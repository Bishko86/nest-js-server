import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './create-menu-dto';
import { UpdateMenuDto } from './update-menu-dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  findAll(): Promise<Menu[]> {
    return this.menuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string): Promise<Menu> {
    return this.menuService.findOne(+id);
  }

  @Post()
  create(@Body() createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.menuService.create(createMenuDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<Menu> {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.menuService.remove(+id);
  }
}
