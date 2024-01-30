import { Plugin, TFile, MenuItem } from 'obsidian';
import { PDFDocument, degrees } from 'pdf-lib';

interface RotatePdfSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: RotatePdfSettings = {
	mySetting: 'default'
}

export default class RotatePdfPlugin extends Plugin {
	settings: RotatePdfSettings;

	async onload() {
		await this.loadSettings();
		this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
				if (file instanceof TFile && file.path.toLowerCase().endsWith('.pdf')) {
					menu.addItem((item: MenuItem) => {
						item.setTitle("Rotate PDF");
						item.setIcon("rotate-cw");
						item.onClick(async() => {
							const pdfDoc = await PDFDocument.load(new Uint8Array(await this.app.vault.readBinary(file)));
							pdfDoc.getPages().forEach((page) => {
								var newAngle = page.getRotation().angle + 90;
								if (newAngle >= 360) {
									newAngle = 0;
								}
								page.setRotation(degrees(newAngle));
							});
							await this.app.vault.modifyBinary(file, await pdfDoc.save());
						});
					});
				} 
		}));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

