import { Logger, NotFoundException } from '@nestjs/common';

import { Model, Types, FilterQuery, UpdateQuery } from 'mongoose';
import { AbstractEntity } from './abstract.entity';
import { log } from 'console';

export abstract class AbstractRepository<T extends AbstractEntity> {
  protected readonly logger: Logger;
  constructor(protected readonly model: Model<T>) {}
  public async create(document: Omit<T, '_id'>): Promise<T> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createDocument.save()).toJSON() as T;
  }
  public async findOne(filterQuery: FilterQuery<T>): Promise<T> {
    const document = await this.model.findOne(filterQuery).lean<T>();
    if (!document) {
      this.logger.warn(
        'Document with this filter query not found',
        filterQuery,
      );
      throw new NotFoundException('Document not found');
    }
    return document;
  }
  public async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<T> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<T>();
    if (!document) {
      this.logger.warn(
        'Document with this filter query not found',
        filterQuery,
      );
      throw new NotFoundException('Document not found');
    }
    
    return document;
  }
  public async find(filterQuery: FilterQuery<T>): Promise<T> {
    return await this.model.find(filterQuery).lean<T>();
  }
  public async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T> {
    return await this.model.findOneAndDelete(filterQuery).lean<T>();
  }
}
