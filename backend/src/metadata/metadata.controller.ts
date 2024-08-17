import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { Throttle } from '@nestjs/throttler';

@Controller('metadata')
export class MetadataController {
	constructor(private readonly metadataService: MetadataService) { }

	@Post('fetch')
	// 5 requests per one second
	@Throttle({ default: { limit: 5, ttl: 1 } })


	async fetchMetadata(@Body('urls') urls: string[]) {
		if (!Array.isArray(urls) || urls.length === 0) {
			throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
		}

		try {
			const metadata = await Promise.all(urls.map(url => this.metadataService.fetchMetadata(url)));
			return metadata;
		} catch (error) {
			throw new HttpException('Error fetching metadata', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
