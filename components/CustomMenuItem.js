import * as React from 'react';
import { Menu, useTheme } from 'react-native-paper';

export function CustomMenuItem({ title, icon, onPress, danger = false, disabled = false, testID }) {
    const theme = useTheme();

    return (
        <Menu.Item
            title={title}
            onPress={onPress}
            leadingIcon={icon}
            disabled={disabled}
            titleStyle={danger ? { color: theme.colors.error, fontWeight: '600' } : undefined}
            style={{ minHeight: 44 }}
            testID={testID}
        />
    );
}