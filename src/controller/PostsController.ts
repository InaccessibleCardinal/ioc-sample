import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { PostsService } from '../service/PostsService';
import { TYPES } from '../types/IOCTypes';
import { ResultEnum } from '../types/ResultType';
import { Request, Response } from 'express';

@controller('/posts')
export class PostsController {
  constructor(@inject(TYPES.PostsService) private postsService: PostsService) {
    this.postsService = postsService;
  }

  @httpGet('/')
  public async getPosts(req: Request, res: Response) {
    const postsResult = await this.postsService.getPosts();
    if (postsResult.type === ResultEnum.ERROR) {
      return res.status(500).json({
        message: 'something went wrong.',
        error: postsResult.error.message,
      });
    }
    return { posts: postsResult.value };
  }

  @httpPost('/')
  public async addPost(req: Request, res: Response) {
    const addPostResult = await this.postsService.addPost(req.body);
    if (addPostResult.type === ResultEnum.ERROR) {
      return res.status(500).json({
        message: 'something went wrong.',
        error: addPostResult.error.message,
      });
    }
    return addPostResult.value;
  }
}
