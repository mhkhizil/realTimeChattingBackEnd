import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';
import { Model, Types, FilterQuery, UpdateQuery } from 'mongoose';

export abstract class AbstractRepository<TDocuments extends AbstractDocument> {
  protected readonly logger: Logger;
  constructor(protected readonly model: Model<TDocuments>) {}
  public async create(document: Omit<TDocuments, '_id'>): Promise<TDocuments> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createDocument.save()).toJSON as unknown as TDocuments;
  }
  public async findOne(
    filterQuery: FilterQuery<TDocuments>,
  ): Promise<TDocuments> {
    const document = await this.model.findOne(filterQuery).lean<TDocuments>();
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
    filterQuery: FilterQuery<TDocuments>,
    update: UpdateQuery<TDocuments>,
  ): Promise<TDocuments> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocuments>();
    if (!document) {
      this.logger.warn(
        'Document with this filter query not found',
        filterQuery,
      );
      throw new NotFoundException('Document not found');
    }
    return document;
  }
  public async find(filterQuery: FilterQuery<TDocuments>): Promise<TDocuments> {
    return await this.model.find(filterQuery).lean<TDocuments>();
  }
  public async findOneAndDelete(
    filterQuery: FilterQuery<TDocuments>,
  ): Promise<TDocuments> {
    return await this.model.findOneAndDelete(filterQuery).lean<TDocuments>();
  }
}
