export const extraProblems = [
  {
    title: '3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    order: 11,
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' }
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    boilerplate: {
      javascript: 'function threeSum(nums) {\n  // Your code here\n}',
      python: 'def three_sum(nums):\n    pass',
      java: 'public class Main {\n    public static List<List<Integer>> threeSum(int[] nums) {\n        return null;\n    }\n}'
    }
  },
  {
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'Easy',
    tags: ['Hash Table', 'String', 'Sorting'],
    order: 12,
    description: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' }
    ],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4'],
    boilerplate: {
      javascript: 'function isAnagram(s, t) {\n  // Your code here\n}',
      python: 'def is_anagram(s, t):\n    pass',
      java: 'public class Main {\n    public static boolean isAnagram(String s, String t) {\n        return false;\n    }\n}'
    }
  },
  {
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table', 'Sorting'],
    order: 13,
    description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true' }
    ],
    constraints: ['1 <= nums.length <= 10^5'],
    boilerplate: {
      javascript: 'function containsDuplicate(nums) {\n  // Your code here\n}',
      python: 'def contains_duplicate(nums):\n    pass',
      java: 'public class Main {\n    public static boolean containsDuplicate(int[] nums) {\n        return false;\n    }\n}'
    }
  },
  {
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'String'],
    order: 14,
    description: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
    ],
    constraints: ['1 <= strs.length <= 10^4'],
    boilerplate: {
      javascript: 'function groupAnagrams(strs) {\n  // Your code here\n}',
      python: 'def group_anagrams(strs):\n    pass',
      java: 'public class Main {\n    public static List<List<String>> groupAnagrams(String[] strs) {\n        return null;\n    }\n}'
    }
  },
  {
    title: 'Top K Frequent Elements',
    slug: 'top-k-frequent',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Sorting', 'Heap'],
    order: 15,
    description: `Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.`,
    examples: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' }
    ],
    constraints: ['1 <= nums.length <= 10^5', 'k is in the range [1, the number of unique elements in the array].'],
    boilerplate: {
      javascript: 'function topKFrequent(nums, k) {\n  // Your code here\n}',
      python: 'def top_k_frequent(nums, k):\n    pass',
      java: 'public class Main {\n    public static int[] topKFrequent(int[] nums, int k) {\n        return null;\n    }\n}'
    }
  },
  {
    title: 'Product of Array Except Self',
    slug: 'product-except-self',
    difficulty: 'Medium',
    tags: ['Array', 'Prefix Sum'],
    order: 16,
    description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.`,
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' }
    ],
    constraints: ['2 <= nums.length <= 10^5'],
    boilerplate: {
      javascript: 'function productExceptSelf(nums) {\n  // Your code here\n}',
      python: 'def product_except_self(nums):\n    pass',
      java: 'public class Main {\n    public static int[] productExceptSelf(int[] nums) {\n        return null;\n    }\n}'
    }
  },
  {
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'String'],
    order: 17,
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.`,
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true' }
    ],
    constraints: ['1 <= s.length <= 2 * 10^5'],
    boilerplate: {
      javascript: 'function isPalindrome(s) {\n  // Your code here\n}',
      python: 'def is_palindrome(s):\n    pass',
      java: 'public class Main {\n    public static boolean isPalindrome(String s) {\n        return false;\n    }\n}'
    }
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming'],
    order: 18,
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5' }
    ],
    constraints: ['1 <= prices.length <= 10^5'],
    boilerplate: {
      javascript: 'function maxProfit(prices) {\n  // Your code here\n}',
      python: 'def max_profit(prices):\n    pass',
      java: 'public class Main {\n    public static int maxProfit(int[] prices) {\n        return 0;\n    }\n}'
    }
  },
  {
    title: 'Longest Repeating Character Replacement',
    slug: 'longest-repeating-character-replacement',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    order: 19,
    description: `You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times.\n\nReturn the length of the longest substring containing the same letter you can get after performing the above operations.`,
    examples: [
      { input: 's = "ABAB", k = 2', output: '4' }
    ],
    constraints: ['1 <= s.length <= 10^5'],
    boilerplate: {
      javascript: 'function characterReplacement(s, k) {\n  // Your code here\n}',
      python: 'def character_replacement(s, k):\n    pass',
      java: 'public class Main {\n    public static int characterReplacement(String s, int k) {\n        return 0;\n    }\n}'
    }
  },
  {
    title: 'Minimum Window Substring',
    slug: 'minimum-window-substring',
    difficulty: 'Hard',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    order: 20,
    description: `Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".`,
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' }
    ],
    constraints: ['m == s.length', 'n == t.length'],
    boilerplate: {
      javascript: 'function minWindow(s, t) {\n  // Your code here\n}',
      python: 'def min_window(s, t):\n    pass',
      java: 'public class Main {\n    public static String minWindow(String s, String t) {\n        return "";\n    }\n}'
    }
  },
  {
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    order: 21,
    description: `Given the root of a binary tree, invert the tree, and return its root.`,
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 100].'],
    boilerplate: {
      javascript: 'function invertTree(root) {\n  // Your code here\n}',
      python: 'def invert_tree(root):\n    pass',
      java: 'public class Main {\n    public static TreeNode invertTree(TreeNode root) {\n        return null;\n    }\n}'
    }
  },
  {
    title: 'Maximum Depth of Binary Tree',
    slug: 'maximum-depth-of-binary-tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    order: 22,
    description: `Given the root of a binary tree, return its maximum depth.\n\nA binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3' }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 10^4].'],
    boilerplate: {
      javascript: 'function maxDepth(root) {\n  // Your code here\n}',
      python: 'def max_depth(root):\n    pass',
      java: 'public class Main {\n    public static int maxDepth(TreeNode root) {\n        return 0;\n    }\n}'
    }
  },
  {
    title: 'Diameter of Binary Tree',
    slug: 'diameter-of-binary-tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
    order: 23,
    description: `Given the root of a binary tree, return the length of the diameter of the tree.\n\nThe diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.`,
    examples: [
      { input: 'root = [1,2,3,4,5]', output: '3' }
    ],
    constraints: ['The number of nodes in the tree is in the range [1, 10^4].'],
    boilerplate: {
      javascript: 'function diameterOfBinaryTree(root) {\n  // Your code here\n}',
      python: 'def diameter_of_binary_tree(root):\n    pass',
      java: 'public class Main {\n    public static int diameterOfBinaryTree(TreeNode root) {\n        return 0;\n    }\n}'
    }
  },
  {
    title: 'Balanced Binary Tree',
    slug: 'balanced-binary-tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
    order: 24,
    description: `Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is defined as a binary tree in which the left and right subtrees of every node differ in height by no more than 1.`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: 'true' }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 5000].'],
    boilerplate: {
      javascript: 'function isBalanced(root) {\n  // Your code here\n}',
      python: 'def is_balanced(root):\n    pass',
      java: 'public class Main {\n    public static boolean isBalanced(TreeNode root) {\n        return false;\n    }\n}'
    }
  },
  {
    title: 'Same Tree',
    slug: 'same-tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    order: 25,
    description: `Given the roots of two binary trees p and q, write a function to check if they are the same or not.\n\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.`,
    examples: [
      { input: 'p = [1,2,3], q = [1,2,3]', output: 'true' }
    ],
    constraints: ['The number of nodes in both trees is in the range [0, 100].'],
    boilerplate: {
      javascript: 'function isSameTree(p, q) {\n  // Your code here\n}',
      python: 'def is_same_tree(p, q):\n    pass',
      java: 'public class Main {\n    public static boolean isSameTree(TreeNode p, TreeNode q) {\n        return false;\n    }\n}'
    }
  },
  {
    title: 'Subtree of Another Tree',
    slug: 'subtree-of-another-tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'String Matching', 'Binary Tree', 'Hash Function'],
    order: 26,
    description: `Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise.`,
    examples: [
      { input: 'root = [3,4,5,1,2], subRoot = [4,1,2]', output: 'true' }
    ],
    constraints: ['The number of nodes in the root tree is in the range [1, 2000].'],
    boilerplate: {
      javascript: 'function isSubtree(root, subRoot) {\n  // Your code here\n}',
      python: 'def is_subtree(root, sub_root):\n    pass',
      java: 'public class Main {\n    public static boolean isSubtree(TreeNode root, TreeNode subRoot) {\n        return false;\n    }\n}'
    }
  },
  {
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    slug: 'lowest-common-ancestor-of-a-binary-search-tree',
    difficulty: 'Medium',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    order: 27,
    description: `Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.`,
    examples: [
      { input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8', output: '6' }
    ],
    constraints: ['The number of nodes in the tree is in the range [2, 10^5].'],
    boilerplate: {
      javascript: 'function lowestCommonAncestor(root, p, q) {\n  // Your code here\n}',
      python: 'def lowest_common_ancestor(root, p, q):\n    pass',
      java: 'public class Main {\n    public static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        return null;\n    }\n}'
    }
  },
  {
    title: 'Linked List Cycle',
    slug: 'linked-list-cycle',
    difficulty: 'Easy',
    tags: ['Hash Table', 'Linked List', 'Two Pointers'],
    order: 28,
    description: `Given head, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.`,
    examples: [
      { input: 'head = [3,2,0,-4], pos = 1', output: 'true' }
    ],
    constraints: ['The number of the nodes in the list is in the range [0, 10^4].'],
    boilerplate: {
      javascript: 'function hasCycle(head) {\n  // Your code here\n}',
      python: 'def has_cycle(head):\n    pass',
      java: 'public class Main {\n    public static boolean hasCycle(ListNode head) {\n        return false;\n    }\n}'
    }
  },
  {
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    order: 29,
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }
    ],
    constraints: ['The number of nodes in the list is the range [0, 5000].'],
    boilerplate: {
      javascript: 'function reverseList(head) {\n  // Your code here\n}',
      python: 'def reverse_list(head):\n    pass',
      java: 'public class Main {\n    public static ListNode reverseList(ListNode head) {\n        return null;\n    }\n}'
    }
  },
  {
    title: 'Reorder List',
    slug: 'reorder-list',
    difficulty: 'Medium',
    tags: ['Linked List', 'Two Pointers', 'Stack', 'Recursion'],
    order: 30,
    description: `You are given the head of a singly linked-list. The list can be represented as:\n\nL0 → L1 → … → Ln - 1 → Ln\n\nReorder the list to be on the following form:\n\nL0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …`,
    examples: [
      { input: 'head = [1,2,3,4]', output: '[1,4,2,3]' }
    ],
    constraints: ['The number of nodes in the list is in the range [1, 5 * 10^4].'],
    boilerplate: {
      javascript: 'function reorderList(head) {\n  // Your code here\n}',
      python: 'def reorder_list(head):\n    pass',
      java: 'public class Main {\n    public static void reorderList(ListNode head) {\n        \n    }\n}'
    }
  },
  {
    title: 'Remove Nth Node From End of List',
    slug: 'remove-nth-node-from-end-of-list',
    difficulty: 'Medium',
    tags: ['Linked List', 'Two Pointers'],
    order: 31,
    description: `Given the head of a linked list, remove the nth node from the end of the list and return its head.`,
    examples: [
      { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]' }
    ],
    constraints: ['The number of nodes in the list is sz.', '1 <= sz <= 30', '1 <= n <= sz'],
    boilerplate: {
      javascript: 'function removeNthFromEnd(head, n) {\n  // Your code here\n}',
      python: 'def remove_nth_from_end(head, n):\n    pass',
      java: 'public class Main {\n    public static ListNode removeNthFromEnd(ListNode head, int n) {\n        return null;\n    }\n}'
    }
  },
  {
    title: 'Copy List with Random Pointer',
    slug: 'copy-list-with-random-pointer',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Linked List'],
    order: 32,
    description: `A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null.\n\nConstruct a deep copy of the list.`,
    examples: [
      { input: 'head = [[7,null],[13,0],[11,4],[10,2],[1,0]]', output: '[[7,null],[13,0],[11,4],[10,2],[1,0]]' }
    ],
    constraints: ['0 <= n <= 1000'],
    boilerplate: {
      javascript: 'function copyRandomList(head) {\n  // Your code here\n}',
      python: 'def copy_random_list(head):\n    pass',
      java: 'public class Main {\n    public static Node copyRandomList(Node head) {\n        return null;\n    }\n}'
    }
  },
  {
    title: 'Add Two Numbers',
    slug: 'add-two-numbers',
    difficulty: 'Medium',
    tags: ['Linked List', 'Math', 'Recursion'],
    order: 33,
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.`,
    examples: [
      { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]' }
    ],
    constraints: ['The number of nodes in each linked list is in the range [1, 100].'],
    boilerplate: {
      javascript: 'function addTwoNumbers(l1, l2) {\n  // Your code here\n}',
      python: 'def add_two_numbers(l1, l2):\n    pass',
      java: 'public class Main {\n    public static ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        return null;\n    }\n}'
    }
  },
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
    order: 34,
    description: `Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.`,
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' }
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300'],
    boilerplate: {
      javascript: 'function numIslands(grid) {\n  // Your code here\n}',
      python: 'def num_islands(grid):\n    pass',
      java: 'public class Main {\n    public static int numIslands(char[][] grid) {\n        return 0;\n    }\n}'
    }
  },
  {
    title: 'Clone Graph',
    slug: 'clone-graph',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Depth-First Search', 'Breadth-First Search', 'Graph'],
    order: 35,
    description: `Return a deep copy (clone) of a graph.`,
    examples: [
      { input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' }
    ],
    constraints: ['The number of nodes in the graph is in the range [0, 100].'],
    boilerplate: {
      javascript: 'function cloneGraph(node) {\n  // Your code here\n}',
      python: 'def clone_graph(node):\n    pass',
      java: 'public class Main {\n    public static Node cloneGraph(Node node) {\n        return null;\n    }\n}'
    }
  },
  {
    title: 'Course Schedule',
    slug: 'course-schedule',
    difficulty: 'Medium',
    tags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
    order: 36,
    description: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nReturn true if you can finish all courses. Otherwise, return false.`,
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' }
    ],
    constraints: ['1 <= numCourses <= 2000'],
    boilerplate: {
      javascript: 'function canFinish(numCourses, prerequisites) {\n  // Your code here\n}',
      python: 'def can_finish(numCourses, prerequisites):\n    pass',
      java: 'public class Main {\n    public static boolean canFinish(int numCourses, int[][] prerequisites) {\n        return false;\n    }\n}'
    }
  },
  {
    title: 'Word Search',
    slug: 'word-search',
    difficulty: 'Medium',
    tags: ['Array', 'Backtracking', 'Matrix'],
    order: 37,
    description: `Given an m x n grid of characters board and a string word, return true if word exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' }
    ],
    constraints: ['m == board.length', 'n = board[i].length', '1 <= m, n <= 6'],
    boilerplate: {
      javascript: 'function exist(board, word) {\n  // Your code here\n}',
      python: 'def exist(board, word):\n    pass',
      java: 'public class Main {\n    public static boolean exist(char[][] board, String word) {\n        return false;\n    }\n}'
    }
  },
  {
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Breadth-First Search'],
    order: 38,
    description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.`,
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3' }
    ],
    constraints: ['1 <= coins.length <= 12'],
    boilerplate: {
      javascript: 'function coinChange(coins, amount) {\n  // Your code here\n}',
      python: 'def coin_change(coins, amount):\n    pass',
      java: 'public class Main {\n    public static int coinChange(int[] coins, int amount) {\n        return 0;\n    }\n}'
    }
  },
  {
    title: 'Longest Increasing Subsequence',
    slug: 'longest-increasing-subsequence',
    difficulty: 'Medium',
    tags: ['Array', 'Binary Search', 'Dynamic Programming'],
    order: 39,
    description: `Given an integer array nums, return the length of the longest strictly increasing subsequence.`,
    examples: [
      { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4' }
    ],
    constraints: ['1 <= nums.length <= 2500'],
    boilerplate: {
      javascript: 'function lengthOfLIS(nums) {\n  // Your code here\n}',
      python: 'def length_of_lis(nums):\n    pass',
      java: 'public class Main {\n    public static int lengthOfLIS(int[] nums) {\n        return 0;\n    }\n}'
    }
  },
  {
    title: 'House Robber',
    slug: 'house-robber',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming'],
    order: 40,
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: '4' }
    ],
    constraints: ['1 <= nums.length <= 100'],
    boilerplate: {
      javascript: 'function rob(nums) {\n  // Your code here\n}',
      python: 'def rob(nums):\n    pass',
      java: 'public class Main {\n    public static int rob(int[] nums) {\n        return 0;\n    }\n}'
    }
  }
];
