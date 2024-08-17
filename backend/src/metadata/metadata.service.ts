import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { JSDOM } from 'jsdom';

@Injectable()
export class MetadataService {
	async fetchMetadata(url: string) {
		try {
			// Fetch the HTML content from the URL
			const { data } = await axios.get(url);

			// Parse the HTML content
			const dom = new JSDOM(data);
			const document = dom.window.document;

			// Extract metadata from meta tags
			const title = this.getMetaContent(document, 'og:title') || document.title;
			const description = this.getMetaContent(document, 'og:description') || this.getMetaContent(document, 'description') || '';
			const image = this.getMetaContent(document, 'og:image') || '';

			return { title, description, image };
		} catch (error) {
			throw new HttpException('Failed to fetch metadata', HttpStatus.BAD_REQUEST);
		}
	}

	// Utility method to extract meta tag content
	private getMetaContent(document: Document, property: string): string | null {
		const metaTag = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
		return metaTag ? metaTag.getAttribute('content') : null;
	}
}
