import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './entity/boards.enum';
import { CreateBoardDTO } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/boards-validation.pipe';
import { Board } from './entity/board.entity';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/entity/user.entity';

@Controller('boards')
@UseGuards(AuthGuard('jwt'))
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get(':id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }

  @Get()
  getAllBoards(@getUser() user: User): Promise<Board[]> {
    return this.boardsService.getAllBoards(user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDTO: CreateBoardDTO, @getUser() user: User): Promise<Board> {
    return this.boardsService.createBoard(createBoardDTO, user);
  }

  @Delete(':id')
  deleteBoard(@Param('id', ParseIntPipe) id: string, @getUser() user: User): Promise<void> {
    return this.boardsService.deleteBoard(id, user);
  }

  @Patch(':id/status')
  updateBoard(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ): Promise<Board> {
    return this.boardsService.updateBoard(id, status);
  }
}
