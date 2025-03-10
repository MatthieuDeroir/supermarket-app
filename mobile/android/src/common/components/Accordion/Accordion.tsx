import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

interface AccordionProps {
  title: string;
  content: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
  const [expanded, setExpanded] = useState(false);
  const animationHeight = new Animated.Value(0);

  const toggleExpand = () => {
    if (expanded) {
      Animated.timing(animationHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animationHeight, {
        toValue: 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    setExpanded(!expanded);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        <Text style={styles.arrow}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.content, { height: animationHeight }]}>
        <Text style={styles.contentText}>{content}</Text>
      </Animated.View>
    </View>
    // <View style={styles.container}>
    //   <TouchableOpacity onPress={toggleExpand} style={styles.header}>
    //     <Text style={styles.headerText}>{title}</Text>
    //     <Text style={styles.arrow}>{expanded ? '▲' : '▼'}</Text>
    //   </TouchableOpacity>

    //   <Animated.View style={[styles.content, { height: animationHeight }]}>
    //     <Text style={styles.contentText}>{content}</Text>
    //   </Animated.View>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 16,
  },
  content: {
    overflow: 'hidden',
    paddingHorizontal: 15,
  },
  contentText: {
    fontSize: 14,
    paddingVertical: 10,
  },
});

export default Accordion;
