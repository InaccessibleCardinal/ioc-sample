import https from 'https';
import { IncomingMessage, RequestOptions } from 'http';
import { injectable } from 'inversify';
import { HttpTypes } from '../types/HttpTypes';
import { ResultEnum, ResultType } from '../types/ResultType';
import { OutgoingHttpHeaders } from 'http2';

type HttpClientOptions = { dataToSend?: any } & RequestOptions;
type HttpResult = ResultType<any, Error>;

function tryParse(str: string) {
  try {
    return JSON.parse(str);
  } catch (err) {
    return str;
  }
}

function checkIsBadStatus(incomingMessage: IncomingMessage) {
  return (
    incomingMessage &&
    incomingMessage.statusCode &&
    incomingMessage.statusCode > 399
  );
}

@injectable()
export class HttpClient {
  private _https: typeof https;

  constructor() {
    this._https = https;
  }

  public get(
    host: string,
    path: string,
    headers?: OutgoingHttpHeaders
  ): Promise<HttpResult> {
    const method = HttpTypes.GET;
    return this.delegate({ host, path, method, headers }, false);
  }

  public post(
    host: string,
    path: string,
    dataToSend: string,
    headers?: OutgoingHttpHeaders
  ): Promise<HttpResult> {
    const method = HttpTypes.POST;
    return this.delegate({ host, path, method, dataToSend, headers }, true);
  }

  public put(
    host: string,
    path: string,
    dataToSend: string,
    headers?: OutgoingHttpHeaders
  ): Promise<HttpResult> {
    const method = HttpTypes.PUT;
    return this.delegate({ host, path, method, dataToSend, headers }, true);
  }

  public delete(
    host: string,
    path: string,
    dataToSend: string,
    headers?: OutgoingHttpHeaders
  ): Promise<HttpResult> {
    const method = HttpTypes.DELETE;
    return this.delegate({ host, path, method, dataToSend, headers }, true);
  }

  private delegate(
    options: HttpClientOptions,
    hasData: boolean
  ): Promise<HttpResult> {
    if (!options.host || !options.path) {
      return Promise.resolve({
        type: ResultEnum.ERROR,
        error: new Error(
          `Bad Request. Received host: ${options.host}, path: ${options.path}`
        ),
      });
    }

    if (hasData && !options.dataToSend) {
      return Promise.resolve({
        type: ResultEnum.ERROR,
        error: new Error(`Bad Request. Received data: ${options.dataToSend}`),
      });
    }
    return this.makeRequest(options);
  }

  private makeRequest(options: HttpClientOptions): Promise<HttpResult> {
    const { dataToSend, ...rest } = options;
    return new Promise((resolve) => {
      const currentRequest = this._https.request(
        rest,
        (incomingMessage: IncomingMessage) => {
          let data = '';
          incomingMessage.on('data', (chunk) => {
            data += chunk;
          });

          incomingMessage.on('end', () => {
            if (checkIsBadStatus(incomingMessage)) {
              resolve({
                type: ResultEnum.ERROR,
                error: new Error(
                  `Bad Status: ${
                    incomingMessage.statusCode
                  }. Response data: ${JSON.stringify(data)}`
                ),
              });
            }
            resolve({ type: ResultEnum.SUCCESS, value: tryParse(data) });
          });
        }
      );

      currentRequest.on('error', (err) => {
        resolve({ type: ResultEnum.ERROR, error: err });
      });
      if (dataToSend) {
        currentRequest.write(dataToSend);
      }
      currentRequest.end();
    });
  }
}
