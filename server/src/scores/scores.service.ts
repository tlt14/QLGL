import { Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';
import { Repository } from 'typeorm';
import { Class } from 'src/classes/entities/class.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score) private scoreRepository: Repository<Score>,
    @InjectRepository(Class) private classRepository: Repository<Class>
  ) {}
  create(createScoreDto: CreateScoreDto) {
    console.log(createScoreDto);
    const payload = Object.entries(createScoreDto).map(([id, score]) => ({ student: id, ...score }));
    return this.scoreRepository.save(payload);
  }

  findAll() {
    return this.scoreRepository.find({
      relations: ['student'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} score`;
  }

  update(id: number, updateScoreDto: UpdateScoreDto) {
    return `This action updates a #${id} score`;
  }

  remove(id: number) {
    return `This action removes a #${id} score`;
  }
  async findByClass(classId: string) {
    const scores = await this.scoreRepository.find({
      where: {
        student: {
          class: {
            id: classId,
          },
        },
      },
      relations: ['student'],
    });

    if (scores.length === 0) {
      // throw new Error('Scores not found');
      const myClass = await this.classRepository.findOne({
        where: {
          id: classId,
        },
        relations: ['students'],
      });
      if (!myClass) {
        throw new Error('Class not found');
      }
      return myClass.students;
    }
    return scores;
  }
}
