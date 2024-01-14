import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { Repository } from 'typeorm';
import { CreateMenuDto } from './create-menu-dto';
import { UpdateMenuDto } from './update-menu-dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async findAll(): Promise<Menu[]> {
    const menu = await this.menuRepository.find();
    console.log(menu);
    return menu;
  }

  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOne({ where: { id: id } });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = this.menuRepository.create(createMenuDto);
    return await this.menuRepository.save(menu);
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findOne(id);
    Object.assign(menu, updateMenuDto);
    return await this.menuRepository.save(menu);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.menuRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`A menu "${id}" was not found`);
    }
    return { message: 'Menu successfully deleted' };
  }
}
