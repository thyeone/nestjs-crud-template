import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './entity/boards.enum';
import { CreateBoardDTO } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entity/board.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class BoardsService {
  constructor(@InjectRepository(Board) private boardRepository: Repository<Board>) {}

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne({
      where: {
        id,
      },
    });

    if (!found) {
      throw new NotFoundException(`${id}의 게시물을 찾을 수 없습니다.`);
    }

    return found;
  }

  async getAllBoards(user: User): Promise<Board[]> {
    // const query = this.boardRepository.createQueryBuilder('board');

    // query.where('board.userId = :userId', { userId: user.id });

    // const boards = await query.getMany();

    const boards = await this.boardRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    return boards;
  }

  async createBoard(createBoardDTO: CreateBoardDTO, user: User): Promise<Board> {
    const { title, description } = createBoardDTO;

    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user,
    });

    await this.boardRepository.save(board);

    return board;
  }

  async deleteBoard(id: string, user: User): Promise<void> {
    const result = await this.boardRepository
      .createQueryBuilder('board')
      .delete()
      .from(Board)
      .where('userId = :userId', { userId: user.id })
      .andWhere('id = :id', { id: id })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`${id} 게시글을 찾을 수 없습니다.`);
    }
  }

  async updateBoard(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;

    await this.boardRepository.save(board);

    return board;
  }
}
