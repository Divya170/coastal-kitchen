import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuCategory } from './menu-category.entity';
import { MenuItem } from './menu-item.entity';
import { MenuCategoriesAdminController, MenuController, MenuItemsAdminController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuCategory, MenuItem])],
  controllers: [MenuController, MenuCategoriesAdminController, MenuItemsAdminController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
