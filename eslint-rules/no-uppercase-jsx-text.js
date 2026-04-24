/**
 * ESLint rule: no-uppercase-jsx-text
 *
 * Flags JSX text nodes that contain uppercase letters.
 * Dynamic expressions ({someVar}) are AST nodes, not JSXText, so they are
 * naturally excluded — song titles and names passed as props are never flagged.
 */
'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow uppercase letters in static JSX text labels',
    },
    schema: [],
    messages: {
      uppercase:
        'Static JSX text must be lowercase. Found: "{{ text }}"',
    },
  },
  create(context) {
    return {
      JSXText(node) {
        const trimmed = node.value.replace(/\s/g, '');
        if (trimmed.length > 0 && trimmed !== trimmed.toLowerCase()) {
          context.report({
            node,
            messageId: 'uppercase',
            data: { text: node.value.trim() },
          });
        }
      },
    };
  },
};
