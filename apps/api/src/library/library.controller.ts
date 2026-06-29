import { Controller, Get, Patch, Delete, Param, Query, Body, UseGuards, Req, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUserLibrary, UpdateSessionMetadata, RecordSessionView } from '@chessome/application';

@Controller('v1/library')
@UseGuards(JwtAuthGuard)
export class LibraryController {
  constructor(
    private readonly getUserLibrary: GetUserLibrary,
    private readonly updateSessionMetadata: UpdateSessionMetadata,
    private readonly recordSessionView: RecordSessionView,
  ) {}

  @Get('sessions')
  async getSessions(
    @Req() req: any,
    @Query('folder') folder?: 'recent' | 'favorites' | 'archived' | 'trash',
    @Query('collectionId') collectionId?: string,
    @Query('q') q?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const userId = req.user.id;
    const result = await this.getUserLibrary.execute({
      userId,
      folder,
      collectionId,
      searchQuery: q,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    if (!result.isOk) {
      throw new BadRequestException(result.error.message);
    }

    return result.value;
  }

  @Patch('sessions/:id')
  async updateSession(
    @Req() req: any,
    @Param('id') sessionId: string,
    @Body() body: any,
  ) {
    const userId = req.user.id;
    const result = await this.updateSessionMetadata.execute({
      userId,
      sessionId,
      isFavorite: body.isFavorite,
      tags: body.tags,
      notes: body.notes,
      collection: body.collection,
      isArchived: body.isArchived,
      isTrash: body.isTrash,
      title: body.title,
    });

    if (!result.isOk) {
      if (result.error.message === 'Session not found') {
        throw new NotFoundException(result.error.message);
      }
      throw new BadRequestException(result.error.message);
    }

    return { success: true };
  }

  @Delete('sessions/:id')
  async moveToTrash(
    @Req() req: any,
    @Param('id') sessionId: string,
  ) {
    const userId = req.user.id;
    const result = await this.updateSessionMetadata.execute({
      userId,
      sessionId,
      isTrash: true,
    });

    if (!result.isOk) {
      if (result.error.message === 'Session not found') {
        throw new NotFoundException(result.error.message);
      }
      throw new BadRequestException(result.error.message);
    }

    return { success: true };
  }

  @Patch('sessions/:id/view')
  async recordView(
    @Req() req: any,
    @Param('id') sessionId: string,
  ) {
    const userId = req.user.id;
    try {
      await this.recordSessionView.execute(userId, sessionId);
      return { success: true };
    } catch (error: any) {
      if (error.message === 'Session not found') {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }
}
