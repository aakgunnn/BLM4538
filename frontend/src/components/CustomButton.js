import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const CustomButton = ({ title, onPress, style, textStyle, variant = 'primary' }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' ? styles.secondaryButton : styles.primaryButton,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.text,
        variant === 'secondary' ? styles.secondaryText : styles.primaryText,
        textStyle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.surface,
  },
  secondaryText: {
    color: Colors.primary,
  },
});

export default CustomButton;
