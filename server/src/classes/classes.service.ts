import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>
  ) {}
  create(createClassDto: CreateClassDto) {
    return this.classesRepository.save(createClassDto);
  }

  findAll() {
    return this.classesRepository.find({
      relations: ['grade', 'students'],
    });
  }

  findOne(id: string) {
    return this.classesRepository.findOne({ where: { id } });
  }

  update(id: string, updateClassDto: UpdateClassDto) {
    console.log(updateClassDto);
    delete updateClassDto.students;
    return this.classesRepository.update(id, {
      ...updateClassDto,
    });
  }

  remove(id: string) {
    return this.classesRepository.delete(id);
  }
}
