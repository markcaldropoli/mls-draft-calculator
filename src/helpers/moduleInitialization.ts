import { CellStyleModule, CheckboxEditorModule, ClientSideRowModelModule, ColumnApiModule, ModuleRegistry, RowSelectionModule, ValidationModule } from 'ag-grid-community';
import { ClipboardModule, ContextMenuModule, ExcelExportModule, SetFilterModule } from 'ag-grid-enterprise';

export const InitializeAgGrid = () => {
    ModuleRegistry.registerModules([
        ClientSideRowModelModule,
        ValidationModule,
        SetFilterModule,
        CellStyleModule,
        ContextMenuModule,
        ClipboardModule,
        ExcelExportModule,
        ColumnApiModule,
        RowSelectionModule,
        CheckboxEditorModule
    ]);
}