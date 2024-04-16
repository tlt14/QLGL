import { Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private readonly gradesRepository: Repository<Grade>
  ) {}
  create(createGradeDto: CreateGradeDto) {
    return this.gradesRepository.save(createGradeDto);
  }

  findAll() {
    return this.gradesRepository.find({
      relations: ['classes', 'classes.students'],
    });
  }

  findOne(id: string) {
    return this.gradesRepository.findOne({ where: { id } });
  }

  update(id: string, updateGradeDto: UpdateGradeDto) {
    return this.gradesRepository.update(id, updateGradeDto);
  }

  remove(id: string) {
    return this.gradesRepository.softDelete({ id });
  }
}
