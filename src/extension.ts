import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const copyAddonName = vscode.commands.registerCommand(
    "odoo-tools.copyAddonName",
    (uri: vscode.Uri) => {
      const resourceUri = uri || vscode.window.activeTextEditor?.document.uri;

      if (resourceUri) {
        const filePath = resourceUri.fsPath;

        // Regex logic:
        // Look for 'addons' followed by a slash, then capture everything
        // until the next slash.
        const match = filePath.match(/[\\/]addons[\\/]([^\\/]+)/);

        if (match && match[1]) {
          const addonName = match[1];
          vscode.env.clipboard.writeText(addonName).then(() => {
            vscode.window.showInformationMessage(
              `Odoo-tools: Copied '${addonName}' to clipboard`,
            );
          });
        } else {
          vscode.window.showWarningMessage(
            'Odoo-tools: Could not detect an Odoo "addons" folder in this path.',
          );
        }
      }
    },
  );

  context.subscriptions.push(copyAddonName);
}

export function deactivate() {}
