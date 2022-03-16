import nock from 'nock';
import { HttpClient } from './HttpClient';
import { ResultEnum } from '../types/ResultType';

const testHost = 'test.com';

const testClient = new HttpClient();

describe('HttpClient validators', () => {
  it('should return a bad request Result', () => {
    expect(testClient.get('', '/path')).resolves.toEqual({
      type: ResultEnum.ERROR,
      error: new Error(`Bad Request. Received host: , path: /path`),
    });
  });

  it('should return a bad request Result', () => {
    expect(testClient.post('host.com', '/path', '')).resolves.toEqual({
      type: ResultEnum.ERROR,
      error: new Error(`Bad Request. Received data: `),
    });
  });
});

describe('HttpClient methods', () => {
  it('should perform a GET', async () => {
    const mock = { data: 'some test data' };
    nock(`https://test.com`).get(`/test`).reply(200, mock);
    const result = await testClient.get(testHost, '/test');
    expect(result).toEqual({
      type: ResultEnum.SUCCESS,
      value: mock,
    });
  });

  it('should perform a GET and allow string response', async () => {
    const mock = '<data>42</data>';
    nock(`https://test.com`).get(`/test`).reply(200, mock);
    const result = await testClient.get(testHost, '/test');
    expect(result).toEqual({
      type: ResultEnum.SUCCESS,
      value: mock,
    });
  });

  it('should perform a POST', async () => {
    const mock = { message: 'created' };
    const testBody = JSON.stringify({ data: 42 });
    nock(`https://test.com`)
      .post(`/test`, (body) => body.data === 42)
      .reply(201, mock);
    const result = await testClient.post(testHost, '/test', testBody);
    expect(result).toEqual({
      type: ResultEnum.SUCCESS,
      value: mock,
    });
  });

  it('should perform a PUT', async () => {
    const mock = { message: 'updated' };
    const testBody = JSON.stringify({ problems: 99 });
    nock(`https://test.com`)
      .put(`/test`, (body) => body.problems === 99)
      .reply(201, mock);
    const result = await testClient.put(testHost, '/test', testBody);
    expect(result).toEqual({
      type: ResultEnum.SUCCESS,
      value: mock,
    });
  });

  it('should perform a DELETE', async () => {
    const mock = { message: 'deleted' };
    const testBody = JSON.stringify({ id: 99 });
    nock(`https://test.com`)
      .delete(`/test`, (body) => body.id === 99)
      .reply(201, mock);
    const result = await testClient.delete(testHost, '/test', testBody);
    expect(result).toEqual({
      type: ResultEnum.SUCCESS,
      value: mock,
    });
  });

  it('should return an error Result', async () => {
    nock(`https://test.com`)
      .get(`/badtest`)
      .replyWithError('internal server error');
    const result = await testClient.get(testHost, '/badtest');
    expect(result).toEqual({
      type: ResultEnum.ERROR,
      error: new Error('internal server error'),
    });
  });

  it('should return a bad status error Result', async () => {
    const mock = { message: 'forbidden' };
    const stringifiedMock = JSON.stringify(mock);
    nock(`https://test.com`).get(`/four-o-three`).reply(403, mock);
    const result = await testClient.get(testHost, '/four-o-three');
    expect(result).toEqual({
      type: ResultEnum.ERROR,
      error: new Error(
        `Bad Status: 403. Response data: ${JSON.stringify(stringifiedMock)}`
      ),
    });
  });
});
