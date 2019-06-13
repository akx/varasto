import request from 'request';

export interface ClientOptions {
  hostname: string;
  port: number;
  secure: boolean;
}

export class Client {
  private readonly options: ClientOptions;

  public constructor(options?: Partial<ClientOptions>) {
    this.options = Object.assign({
      hostname: '0.0.0.0',
      port: 3000,
      secure: false,
    }, options);
  }

  public getItem(key: string): Promise<Object|undefined> {
    return new Promise<Object|undefined>((resolve, reject) => {
      request(
        {
          method: 'GET',
          uri: this.getItemURL(key),
          json: true,
        },
        (err, response, body) => {
          if (err) {
            reject(err);
            return;
          }

          if (response.statusCode === 404) {
            resolve(undefined);
            return;
          }

          if (response.statusCode !== 200) {
            reject(new Error('Unable to retrieve item'));
            return;
          }

          resolve(body);
        },
      );
    });
  }

  public setItem(key: string, value: Object): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      request(
        {
          method: 'POST',
          uri: this.getItemURL(key),
          body: value,
          json: true,
        },
        (err, response) => {
          if (err) {
            reject(err);
            return;
          }

          if (response.statusCode !== 201) {
            reject(new Error('Unable to store item'));
            return;
          }

          resolve();
        },
      );
    });
  }

  public removeItem(key: string): Promise<Object|undefined> {
    return new Promise<Object|undefined>((resolve, reject) => {
      request(
        {
          method: 'DELETE',
          uri: this.getItemURL(key),
          json: true,
        },
        (err, response, body) => {
          if (err) {
            reject(err);
            return;
          }

          if (response.statusCode === 404) {
            resolve();
            return;
          }

          if (response.statusCode !== 201) {
            reject(new Error('Unable to remove item'));
            return;
          }

          resolve(body);
        },
      );
    });
  }

  public patchItem(key: string, value: Object): Promise<Object|undefined> {
    return new Promise<Object|undefined>((resolve, reject) => {
      request(
        {
          method: 'PATCH',
          uri: this.getItemURL(key),
          body: value,
          json: true,
        },
        (err, response, body) => {
          if (err) {
            reject(err);
            return;
          }

          if (response.statusCode === 404) {
            resolve(undefined);
            return;
          }

          if (response.statusCode !== 201) {
            reject(new Error('Unable to update item'));
            return;
          }

          resolve(body);
        },
      );
    });
  }

  private getItemURL(key: string): string {
    const { hostname, port, secure } = this.options;

    return `http${secure ? 's' : ''}://${hostname}:${port}/${key}`;
  }
}
