import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../common/slug';
import { removeUpload } from '../common/upload';
import { CreateCategoryDto, CreateItemDto, UpdateCategoryDto, UpdateItemDto } from './dto/menu.dto';
import { Layout, MenuCategory, Tint } from './menu-category.entity';
import { MenuItem } from './menu-item.entity';

const blankToNull = (v?: string | null) => (v == null || String(v).trim() === '' ? null : String(v).trim());

export interface CategorySeed { slug: string; name: string; blurb: string; intro: string; layout: Layout; tint: Tint; imageAlt: string }
export interface ItemSeed { category: string; name: string; tint: Tint | null; imageAlt: string; featured?: boolean; highlight?: boolean }

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuCategory) private readonly cats: Repository<MenuCategory>,
    @InjectRepository(MenuItem) private readonly items: Repository<MenuItem>,
  ) {}

  /* ---------- public ---------- */

  /** The published menu: sections with at least one published dish, each with its dishes in order. */
  async publicMenu() {
    const categories = await this.cats.find({ where: { published: true }, order: { sortOrder: 'ASC', id: 'ASC' } });
    const all = await this.items.find({ where: { published: true }, order: { sortOrder: 'ASC', id: 'ASC' } });
    const sections = categories
      .map((c) => ({ ...c, items: all.filter((i) => i.categoryId === c.id) }))
      .filter((c) => c.items.length > 0);
    return { sections, total: sections.reduce((n, s) => n + s.items.length, 0) };
  }

  /** Homepage "From our kitchen": featured dishes first (in a published section), topped up with others. */
  async featured(limit = 4) {
    const { sections } = await this.publicMenu();
    const flat = sections.flatMap((s) => s.items.map((i) => ({ ...i, categoryName: s.name, categorySlug: s.slug })));
    return [...flat.filter((i) => i.featured), ...flat.filter((i) => !i.featured)].slice(0, limit);
  }

  /* ---------- admin: categories ---------- */

  listCategories(search?: string) {
    const qb = this.cats.createQueryBuilder('c').loadRelationCountAndMap('c.itemCount', 'c.items').orderBy('c.sortOrder', 'ASC').addOrderBy('c.id', 'ASC');
    if (search?.trim()) qb.andWhere('(LOWER(c.name) LIKE :q OR LOWER(c.intro) LIKE :q)', { q: `%${search.trim().toLowerCase()}%` });
    return qb.getMany();
  }

  async findCategory(id: number) {
    const c = await this.cats.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Menu section not found.');
    return c;
  }

  private async uniqueSlug(name: string) {
    const base = slugify(name) || 'section';
    let slug = base;
    for (let i = 2; await this.cats.findOne({ where: { slug } }); i++) slug = `${base}-${i}`;
    return slug;
  }

  async createCategory(dto: CreateCategoryDto) {
    const sortOrder = dto.sortOrder ?? (await this.cats.count());
    return this.cats.save(this.cats.create({ ...dto, layout: (dto.layout as Layout) ?? 'left', tint: (dto.tint as Tint) ?? 'plain', slug: await this.uniqueSlug(dto.name), sortOrder }));
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    const c = await this.findCategory(id);
    Object.assign(c, dto);
    return this.cats.save(c);
  }

  async setCategoryImage(id: number, url: string | null) {
    const c = await this.findCategory(id);
    removeUpload(c.imageUrl);
    c.imageUrl = url;
    return this.cats.save(c);
  }

  async removeCategory(id: number) {
    const c = await this.findCategory(id);
    const n = await this.items.count({ where: { categoryId: id } });
    if (n > 0) throw new BadRequestException({ statusCode: 400, message: `Move or delete the ${n} dish${n === 1 ? '' : 'es'} in “${c.name}” first.`, errors: {} });
    removeUpload(c.imageUrl);
    await this.cats.remove(c);
    return { ok: true };
  }

  /* ---------- admin: items ---------- */

  listItems(search?: string, categoryId?: string, status?: string) {
    const qb = this.items.createQueryBuilder('i').leftJoinAndSelect('i.category', 'c').orderBy('c.sortOrder', 'ASC').addOrderBy('i.sortOrder', 'ASC').addOrderBy('i.id', 'ASC');
    if (search?.trim()) qb.andWhere('(LOWER(i.name) LIKE :q OR LOWER(i.description) LIKE :q)', { q: `%${search.trim().toLowerCase()}%` });
    if (categoryId && Number(categoryId)) qb.andWhere('i.categoryId = :cid', { cid: Number(categoryId) });
    if (status === 'published') qb.andWhere('i.published = 1');
    if (status === 'hidden') qb.andWhere('i.published = 0');
    if (status === 'sample') qb.andWhere('i.isSample = 1');
    if (status === 'featured') qb.andWhere('i.featured = 1');
    if (status === 'noprice') qb.andWhere('i.priceCents IS NULL AND i.priceNote IS NULL');
    return qb.getMany();
  }

  async findItem(id: number) {
    const i = await this.items.findOne({ where: { id }, relations: { category: true } });
    if (!i) throw new NotFoundException('Dish not found.');
    return i;
  }

  private clean<T extends Partial<CreateItemDto>>(dto: T) {
    const out: Record<string, unknown> = { ...dto };
    for (const k of ['priceNote', 'badge', 'tint'] as const) if (k in dto) out[k] = blankToNull(dto[k] as string | null);
    if (typeof dto.name === 'string') out.name = dto.name.trim();
    if (dto.dietary) out.dietary = [...new Set(dto.dietary)];
    return out as Partial<MenuItem>;
  }

  async createItem(dto: CreateItemDto) {
    await this.findCategory(dto.categoryId);
    const sortOrder = dto.sortOrder ?? (await this.items.count({ where: { categoryId: dto.categoryId } }));
    const saved = await this.items.save(this.items.create({ ...this.clean(dto), sortOrder }));
    return this.findItem(saved.id);
  }

  async updateItem(id: number, dto: UpdateItemDto) {
    const i = await this.findItem(id);
    if (dto.categoryId) i.category = await this.findCategory(dto.categoryId);
    Object.assign(i, this.clean(dto));
    await this.items.save(i);
    return this.findItem(id);
  }

  async setItemImage(id: number, url: string | null) {
    const i = await this.findItem(id);
    removeUpload(i.imageUrl);
    i.imageUrl = url;
    await this.items.save(i);
    return this.findItem(id);
  }

  async removeItem(id: number) {
    const i = await this.findItem(id);
    removeUpload(i.imageUrl);
    await this.items.remove(i);
    return { ok: true };
  }

  async counts() {
    const [total, samples, published, noPrice, noPhoto] = await Promise.all([
      this.items.count(), this.items.count({ where: { isSample: true } }), this.items.count({ where: { published: true } }),
      this.items.createQueryBuilder('i').where('i.priceCents IS NULL AND i.priceNote IS NULL').getCount(),
      this.items.createQueryBuilder('i').where('i.imageUrl IS NULL AND (i.highlight = 1 OR i.featured = 1)').getCount(),
    ]);
    return { total, samples, published, noPrice, noPhoto };
  }

  /* ---------- seed ---------- */

  async seed(categories: CategorySeed[], items: ItemSeed[], sampleDescription: string) {
    if ((await this.cats.count()) > 0) return;
    const saved = await this.cats.save(categories.map((c, i) => this.cats.create({ ...c, sortOrder: i })));
    const bySlug = new Map(saved.map((c) => [c.slug, c.id]));
    await this.items.save(items.map((it, i) => this.items.create({
      categoryId: bySlug.get(it.category)!, name: it.name, description: sampleDescription, imageAlt: it.imageAlt, tint: it.tint,
      featured: !!it.featured, highlight: !!it.highlight, isSample: true, dietary: [], sortOrder: i,
    })));
  }
}
