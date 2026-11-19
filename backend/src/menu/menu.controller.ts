import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { imageUploadOptions, publicUrlFor, requireFile } from '../common/upload';
import { CreateCategoryDto, CreateItemDto, UpdateCategoryDto, UpdateItemDto } from './dto/menu.dto';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menu: MenuService) {}

  @Get() all() { return this.menu.publicMenu(); }

  @Get('featured')
  featured(@Query('limit') limit?: string) { return this.menu.featured(Math.min(8, Math.max(1, Number(limit) || 4))); }
}

@Controller('admin/menu-categories')
@UseGuards(JwtAuthGuard)
export class MenuCategoriesAdminController {
  constructor(private readonly menu: MenuService) {}

  @Get() list(@Query('search') search?: string) { return this.menu.listCategories(search); }
  @Get(':id') get(@Param('id', ParseIntPipe) id: number) { return this.menu.findCategory(id); }
  @Post() create(@Body() dto: CreateCategoryDto) { return this.menu.createCategory(dto); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) { return this.menu.updateCategory(id, dto); }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions()))
  upload(@Param('id', ParseIntPipe) id: number, @UploadedFile() file?: Express.Multer.File) {
    return this.menu.setCategoryImage(id, publicUrlFor(requireFile(file).filename));
  }

  @Delete(':id/image') clearImage(@Param('id', ParseIntPipe) id: number) { return this.menu.setCategoryImage(id, null); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.menu.removeCategory(id); }
}

@Controller('admin/menu-items')
@UseGuards(JwtAuthGuard)
export class MenuItemsAdminController {
  constructor(private readonly menu: MenuService) {}

  @Get() list(@Query('search') search?: string, @Query('categoryId') categoryId?: string, @Query('status') status?: string) { return this.menu.listItems(search, categoryId, status); }
  @Get('counts') counts() { return this.menu.counts(); }
  @Get(':id') get(@Param('id', ParseIntPipe) id: number) { return this.menu.findItem(id); }
  @Post() create(@Body() dto: CreateItemDto) { return this.menu.createItem(dto); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateItemDto) { return this.menu.updateItem(id, dto); }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions()))
  upload(@Param('id', ParseIntPipe) id: number, @UploadedFile() file?: Express.Multer.File) {
    return this.menu.setItemImage(id, publicUrlFor(requireFile(file).filename));
  }

  @Delete(':id/image') clearImage(@Param('id', ParseIntPipe) id: number) { return this.menu.setItemImage(id, null); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.menu.removeItem(id); }
}
