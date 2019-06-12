import crypto from 'crypto';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

/**
 * Various options that can be given to the storage instance.
 */
export interface StorageOptions {
  /** Path to the directory where items are being stored. */
  dir: string;
  /** Character encoding to use. Defaults to UTF-8. */
  encoding: string;
}

export default class Storage {
  private readonly options: StorageOptions;

  public constructor(options?: Partial<StorageOptions>) {
    this.options = Object.assign(
      {
        dir: './storage',
        encoding: 'utf-8',
      },
      options,
    );
  }

  public getItem(key: string): Promise<any> {
    const itemPath = this.getItemPath(key);

    return new Promise<any>((resolve, reject) => {
      fs.readFile(
        itemPath,
        this.options.encoding,
        (err, text) => {
          if (err) {
            if (err.code === 'ENOENT') {
              resolve(undefined);
            } else {
              reject(err);
            }
            return;
          }

          try {
            const content = JSON.parse(text);

            if (content.key === key) {
              resolve(content.value);
            } else {
              resolve(undefined);
            }
          } catch (err) {
            reject(err);
            return;
          }
        },
      );
    });
  }

  public setItem(key: string, value: any): Promise<string> {
    const itemPath = this.getItemPath(key);

    return this.ensureDirectoryExists()
      .then(() => new Promise<string>((resolve, reject) => {
        const content = { key, value };

        fs.writeFile(
          itemPath,
          JSON.stringify(content),
          this.options.encoding,
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(itemPath);
            }
          },
        );
      }));
  }

  public removeItem(key: string): Promise<boolean> {
    const itemPath = this.getItemPath(key);

    return new Promise<boolean>((resolve, reject) => {
      fs.exists(itemPath, (exists) => {
        if (!exists) {
          resolve(false);
          return;
        }

        fs.unlink(itemPath, (err) => {
          if (err) {
            if (err.code === 'ENOENT') {
              resolve(false);
            } else {
              reject(err);
            }
          } else {
            resolve(true);
          }
        });
      });
    });
  }

  private getItemPath(key: string): string {
    const hash = crypto.createHash('md5').update(key).digest('hex');

    return path.join(
      this.options.dir,
      `${hash}.json`,
    );
  }

  private ensureDirectoryExists(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fs.exists(this.options.dir, (exists) => {
        if (exists) {
          resolve(this.options.dir);
          return;
        }

        mkdirp(this.options.dir, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(this.options.dir);
          }
        });
      });
    });
  }
}
