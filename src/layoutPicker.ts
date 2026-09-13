import { QuickPickItem, window } from "vscode";
import { util } from "./utility";
import * as semver from "semver";

/**
 * Container for D2 Layouts
 */
class LayoutItem implements QuickPickItem {
  label: string;
  description: string;

  constructor(l: string, d: string) {
    this.label = l;
    this.description = d;
  }
}

/**
 * List of Layouts
 */
const layouts: QuickPickItem[] = [
  new LayoutItem("dagre", "The directed graph layout library Dagre"),
  new LayoutItem("elk", "Eclipse Layout Kernel (ELK) with the Layered algorithm"),
];

const layoutTala = new LayoutItem("tala", "Terrastruct's AutoLayout Approach");

const talaPluginName: string =
  process.platform === "win32" ? "d2plugin-tala.exe" : "d2plugin-tala";

/**
 * layouPicker - This will show the quick pick list in
 * the command pallette when called
 */
export class layoutPicker {
  constructor() {
    let includeTala = false;

    // First, check if D2 version >= 0.6.0 (TALA is built-in)
    const version = util.getD2Version();
    if (version && semver.gte(version, "0.6.0")) {
      includeTala = true;
    } else if (util.isFileOnPath(talaPluginName)) {
      // For older versions, check if the plugin file exists on the path
      includeTala = true;
    }

    if (includeTala) {
      if (layouts.indexOf(layoutTala) === -1) {
        layouts.push(layoutTala);
      }
    } else {
      const idx = layouts.indexOf(layoutTala);
      if (idx !== -1) {
        layouts.splice(idx, 1);
      }
    }
  }

  showPicker(): Thenable<QuickPickItem | undefined> {
    return window.showQuickPick(layouts, {
      title: "Layouts",
      canPickMany: false,
      placeHolder: "Choose a layout...",
    });
  }
}
