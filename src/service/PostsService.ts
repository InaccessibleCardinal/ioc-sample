import { inject, injectable } from 'inversify';
import { Post } from '../types/Post';
import { TYPES } from '../types/IOCTypes';
import { HttpClient } from '../http/HttpClient';

@injectable()
export class PostsService {
  private static host = process.env.POSTS_HOST || '';
  private static path = process.env.POSTS_PATH || '';

  constructor(@inject(TYPES.HttpClient) private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public async getPosts() {
    return this.httpClient.get(PostsService.host, PostsService.path);
  }

  public async addPost(post: Post) {
    return this.httpClient.post(
      PostsService.host,
      PostsService.path,
      JSON.stringify(post)
    );
  }
}
