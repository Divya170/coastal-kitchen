import { Module } from '@nestjs/common';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';
import { ContentModule } from '../content/content.module';
import { GalleryModule } from '../gallery/gallery.module';
import { MenuModule } from '../menu/menu.module';
import { SettingsModule } from '../settings/settings.module';
import { SeedService } from './seed.service';

@Module({
  imports: [AdminAuthModule, SettingsModule, ContentModule, MenuModule, GalleryModule],
  providers: [SeedService],
})
export class SeedModule {}
