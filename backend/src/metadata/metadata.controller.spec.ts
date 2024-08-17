import { Test, TestingModule } from '@nestjs/testing';
import { MetadataController } from '../../src/metadata/metadata.controller';
import { MetadataService } from '../../src/metadata/metadata.service';
import { Metadata } from '../interfaces/Metadata';
import * as request from 'supertest';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';

describe('MetadataController', () => {
  let app;
  let mockMetadataService = {
    fetchMetadata: jest.fn().mockResolvedValue([
      { title: 'Example Title', description: 'Example Description', image: 'http://example.com/image.jpg' },
    ]),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MetadataService)
      .useValue(mockMetadataService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should fetch metadata', async () => {
    return request(app.getHttpServer())
      .post('/metadata/fetch')
      .send({ urls: ['http://example.com'] })
      .expect(200)
      .expect([
        { title: 'Example Title', description: 'Example Description', image: 'http://example.com/image.jpg' },
      ]);
  });

  it('should handle invalid URL inputs', async () => {
    return request(app.getHttpServer())
      .post('/metadata/fetch')
      .send({ urls: ['invalid-url'] })
      .expect(400)
      .expect({ statusCode: 400, message: 'Invalid URL' });
  });

  it('should handle errors from MetadataService', async () => {
    mockMetadataService.fetchMetadata.mockRejectedValueOnce(new Error('Service error'));

    return request(app.getHttpServer())
      .post('/metadata/fetch')
      .send({ urls: ['http://example.com'] })
      .expect(500)
      .expect({ statusCode: 500, message: 'Internal server error' });
  });

  it('should return 400 for missing URLs', async () => {
    return request(app.getHttpServer())
      .post('/metadata/fetch')
      .send({ urls: [] })
      .expect(400)
      .expect({ statusCode: 400, message: 'URLs are required' });
  });

  it('should respond with content-type JSON', async () => {
    return request(app.getHttpServer())
      .post('/metadata/fetch')
      .send({ urls: ['http://example.com'] })
      .expect('Content-Type', /json/)
      .expect(200);
  });
});
