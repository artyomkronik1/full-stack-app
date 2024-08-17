import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import { JSDOM } from 'jsdom';

@Injectable()
export class MetadataService {
	private readonly logger = new Logger(MetadataService.name);

	async fetchMetadata(url: string) {
		// Basic URL validation
		if (!this.isValidUrl(url)) {
			throw new HttpException('Invalid URL', HttpStatus.BAD_REQUEST);
		}

		try {
			// Fetch the HTML content from the URL
			const { data } = await axios.get(url, {
				headers: { 'Accept-Encoding': 'gzip, deflate, br' }, // Optimizes request
				timeout: 5000, // Set a timeout to avoid hanging requests
			});

			// Parse the HTML content
			const dom = new JSDOM(data);
			const document = dom.window.document;

			// Extract metadata from meta tags
			const title = this.getMetaContent(document, 'og:title') || document.title;
			const description = this.getMetaContent(document, 'og:description') || this.getMetaContent(document, 'description') || '';
			const image = this.getMetaContent(document, 'og:image') || '';

			return { title, description, image };
		} catch (error) {
			this.logger.error(`Failed to fetch metadata from ${url}: ${error.message}`);
			throw new HttpException('Failed to fetch metadata', HttpStatus.BAD_REQUEST);
		}
	}

	// Utility method to extract meta tag content
	private getMetaContent(document: Document, property: string): string | null {
		const metaTag = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
		return metaTag ? metaTag.getAttribute('content') : null;
	}

	// Basic URL validation
	private isValidUrl(url: string): boolean {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	}
}
