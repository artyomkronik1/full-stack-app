import { Test, TestingModule } from '@nestjs/testing';
import { MetadataService } from './metadata.service';
import axios from 'axios';


jest.mock('axios');

describe('MetadataService', () => {
  let service: MetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetadataService],
    }).compile();

    service = module.get<MetadataService>(MetadataService);
  });

  it('should fetch metadata for a valid URL', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: '<html><head><title>Test</title></head></html>' });
    const result = await service.fetchMetadata('http://example.com');
    expect(result).toHaveProperty('title');
  });

  it('should handle invalid URL', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Network Error'));
    await expect(service.fetchMetadata('invalid-url')).rejects.toThrow('Failed to fetch metadata');
  });
});
