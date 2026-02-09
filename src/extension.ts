import * as vscode from "vscode";
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const copyAddonName = vscode.commands.registerCommand(
    "odoo-tools.copyAddonName",
    (uri: vscode.Uri) => {
      const resourceUri = uri || vscode.window.activeTextEditor?.document.uri;

      if (resourceUri) {
        let currentDir = path.dirname(resourceUri.fsPath);
        let addonName: string | null = null;

        // 2. Climb up the folder tree to find __manifest__.py
        // We stop if we reach the root of the file system
        while (currentDir !== path.parse(currentDir).root) {
          const manifestPath = path.join(currentDir, "__manifest__.py");

          if (fs.existsSync(manifestPath)) {
            // The directory name containing the manifest is the Addon Name
            addonName = path.basename(currentDir);
            break;
          }

          // Move to the parent directory
          currentDir = path.dirname(currentDir);
        }

        // 3. Handle the result
        if (addonName) {
          vscode.env.clipboard.writeText(addonName).then(() => {
            vscode.window.showInformationMessage(
              `Odoo-tools: Copied addon '${addonName}'`,
            );
          });
        } else {
          vscode.window.showErrorMessage(
            "Odoo-tools: No __manifest__.py found. Is this an Odoo addon?",
          );
        }
      } else {
        vscode.window.showErrorMessage(
          "Odoo-tools: No active file detected.",
        );
      }
    },
  );

  context.subscriptions.push(copyAddonName);
}

export function deactivate() {}
