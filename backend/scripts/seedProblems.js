import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';

dotenv.config();

const problems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    order: 1,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
    boilerplate: {
      javascript: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  // Your code here\n}\n\n// Test\nconsole.log(twoSum([2,7,11,15], 9));',
      python: 'def two_sum(nums, target):\n    # Your code here\n    pass\n\n# Test\nprint(two_sum([2,7,11,15], 9))',
      java: 'public class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n    public static void main(String[] args) {\n        int[] result = twoSum(new int[]{2,7,11,15}, 9);\n        System.out.println(java.util.Arrays.toString(result));\n    }\n}',
    },
  },
  {
    title: 'Reverse String',
    slug: 'reverse-string',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    order: 2,
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.\n\nYou must do this by modifying the input array **in-place** with O(1) extra memory.`,
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: '' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', explanation: '' },
    ],
    constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ascii character.'],
    boilerplate: {
      javascript: '/**\n * @param {string[]} s\n * @return {void} Modify s in-place\n */\nfunction reverseString(s) {\n  // Your code here\n}\n\nconst arr = ["h","e","l","l","o"];\nreverseString(arr);\nconsole.log(arr);',
      python: 'def reverse_string(s):\n    # Your code here\n    pass\n\narr = ["h","e","l","l","o"]\nreverse_string(arr)\nprint(arr)',
      java: 'public class Main {\n    public static void reverseString(char[] s) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        char[] s = {\'h\',\'e\',\'l\',\'l\',\'o\'};\n        reverseString(s);\n        System.out.println(java.util.Arrays.toString(s));\n    }\n}',
    },
  },
  {
    title: 'Palindrome Number',
    slug: 'palindrome-number',
    difficulty: 'Easy',
    tags: ['Math'],
    order: 3,
    description: `Given an integer \`x\`, return \`true\` if \`x\` is a **palindrome**, and \`false\` otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.`,
    examples: [
      { input: 'x = 121', output: 'true', explanation: '121 reads as 121 from left to right and from right to left.' },
      { input: 'x = -121', output: 'false', explanation: 'From left to right it reads -121. From right to left it becomes 121-.' },
    ],
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    boilerplate: {
      javascript: 'function isPalindrome(x) {\n  // Your code here\n}\n\nconsole.log(isPalindrome(121));\nconsole.log(isPalindrome(-121));',
      python: 'def is_palindrome(x):\n    # Your code here\n    pass\n\nprint(is_palindrome(121))\nprint(is_palindrome(-121))',
      java: 'public class Main {\n    public static boolean isPalindrome(int x) {\n        // Your code here\n        return false;\n    }\n    public static void main(String[] args) {\n        System.out.println(isPalindrome(121));\n        System.out.println(isPalindrome(-121));\n    }\n}',
    },
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    tags: ['String', 'Stack'],
    order: 4,
    description: `Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true', explanation: '' },
      { input: 's = "()[]{}"', output: 'true', explanation: '' },
      { input: 's = "(]"', output: 'false', explanation: '' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only.'],
    boilerplate: {
      javascript: 'function isValid(s) {\n  // Your code here\n}\n\nconsole.log(isValid("()"));\nconsole.log(isValid("(]"));',
      python: 'def is_valid(s):\n    # Your code here\n    pass\n\nprint(is_valid("()"))\nprint(is_valid("(]"))',
      java: 'public class Main {\n    public static boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n    public static void main(String[] args) {\n        System.out.println(isValid("()"));\n        System.out.println(isValid("(]"));\n    }\n}',
    },
  },
  {
    title: 'Merge Two Sorted Lists',
    slug: 'merge-two-sorted-lists',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    order: 5,
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.\n\nMerge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.`,
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]', explanation: '' },
      { input: 'list1 = [], list2 = []', output: '[]', explanation: '' },
    ],
    constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100'],
    boilerplate: {
      javascript: '// For simplicity, use arrays to simulate\nfunction mergeTwoLists(l1, l2) {\n  // Your code here\n}\n\nconsole.log(mergeTwoLists([1,2,4], [1,3,4]));',
      python: 'def merge_two_lists(l1, l2):\n    # Your code here\n    pass\n\nprint(merge_two_lists([1,2,4], [1,3,4]))',
      java: 'import java.util.*;\npublic class Main {\n    public static List<Integer> mergeTwoLists(int[] l1, int[] l2) {\n        // Your code here\n        return new ArrayList<>();\n    }\n    public static void main(String[] args) {\n        System.out.println(mergeTwoLists(new int[]{1,2,4}, new int[]{1,3,4}));\n    }\n}',
    },
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating',
    difficulty: 'Medium',
    tags: ['String', 'Sliding Window', 'Hash Table'],
    order: 6,
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    boilerplate: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  // Your code here\n}\n\nconsole.log(lengthOfLongestSubstring("abcabcbb"));',
      python: 'def length_of_longest_substring(s):\n    # Your code here\n    pass\n\nprint(length_of_longest_substring("abcabcbb"))',
      java: 'public class Main {\n    public static int lengthOfLongestSubstring(String s) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        System.out.println(lengthOfLongestSubstring("abcabcbb"));\n    }\n}',
    },
  },
  {
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    order: 7,
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn.\n\nFind two lines that together with the x-axis form a container, such that the container contains the **most water**.\n\nReturn the maximum amount of water a container can store.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The max area is between index 1 and 8.' },
    ],
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    boilerplate: {
      javascript: 'function maxArea(height) {\n  // Your code here\n}\n\nconsole.log(maxArea([1,8,6,2,5,4,8,3,7]));',
      python: 'def max_area(height):\n    # Your code here\n    pass\n\nprint(max_area([1,8,6,2,5,4,8,3,7]))',
      java: 'public class Main {\n    public static int maxArea(int[] height) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7}));\n    }\n}',
    },
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    tags: ['Array', 'Binary Search'],
    order: 8,
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`.\n\nIf \`target\` exists, return its index. Otherwise, return \`-1\`.`,
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1.' },
    ],
    constraints: ['1 <= nums.length <= 10^4', 'All integers in nums are unique.', 'nums is sorted in ascending order.'],
    boilerplate: {
      javascript: 'function search(nums, target) {\n  // Your code here\n}\n\nconsole.log(search([-1,0,3,5,9,12], 9));',
      python: 'def search(nums, target):\n    # Your code here\n    pass\n\nprint(search([-1,0,3,5,9,12], 9))',
      java: 'public class Main {\n    public static int search(int[] nums, int target) {\n        // Your code here\n        return -1;\n    }\n    public static void main(String[] args) {\n        System.out.println(search(new int[]{-1,0,3,5,9,12}, 9));\n    }\n}',
    },
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    order: 9,
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1', explanation: 'The subarray [1] has the largest sum 1.' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    boilerplate: {
      javascript: 'function maxSubArray(nums) {\n  // Your code here\n}\n\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));',
      python: 'def max_sub_array(nums):\n    # Your code here\n    pass\n\nprint(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))',
      java: 'public class Main {\n    public static int maxSubArray(int[] nums) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4}));\n    }\n}',
    },
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    order: 10,
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.\n\nEach time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: '1. 1 step + 1 step\n2. 2 steps' },
      { input: 'n = 3', output: '3', explanation: '1. 1+1+1\n2. 1+2\n3. 2+1' },
    ],
    constraints: ['1 <= n <= 45'],
    boilerplate: {
      javascript: 'function climbStairs(n) {\n  // Your code here\n}\n\nconsole.log(climbStairs(2));\nconsole.log(climbStairs(3));',
      python: 'def climb_stairs(n):\n    # Your code here\n    pass\n\nprint(climb_stairs(2))\nprint(climb_stairs(3))',
      java: 'public class Main {\n    public static int climbStairs(int n) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        System.out.println(climbStairs(2));\n        System.out.println(climbStairs(3));\n    }\n}',
    },
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    await Problem.insertMany(problems);
    console.log(`Seeded ${problems.length} problems successfully!`);

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
