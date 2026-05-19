import { PrismaClient } from '@prisma/client';
import { extraProblems } from '../scripts/problemsData.js';

const prisma = new PrismaClient();

const coreProblems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    order: 1,
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
    boilerplate: {
      javascript: 'function twoSum(nums, target) {\n  // Your code here\n}',
      python: 'def two_sum(nums, target):\n    pass',
      java: 'public class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        return null;\n    }\n}'
    }
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    tags: ['String', 'Stack'],
    order: 2,
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [{ input: 's = "()"', output: 'true' }, { input: 's = "()[]{}"', output: 'true' }],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only'],
    boilerplate: {
      javascript: 'function isValid(s) {\n  // Your code here\n}',
      python: 'def is_valid(s):\n    pass',
      java: 'public class Main {\n    public static boolean isValid(String s) {\n        return false;\n    }\n}'
    }
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    order: 3,
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
    examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' }],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    boilerplate: {
      javascript: 'function maxSubArray(nums) {\n  // Your code here\n}',
      python: 'def max_sub_array(nums):\n    pass',
      java: 'public class Main {\n    public static int maxSubArray(int[] nums) {\n        return 0;\n    }\n}'
    }
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    tags: ['Array', 'Binary Search'],
    order: 4,
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.`,
    examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }],
    constraints: ['1 <= nums.length <= 10^4', 'All values are unique', 'nums is sorted in ascending order'],
    boilerplate: {
      javascript: 'function search(nums, target) {\n  // Your code here\n}',
      python: 'def search(nums, target):\n    pass',
      java: 'public class Main {\n    public static int search(int[] nums, int target) {\n        return -1;\n    }\n}'
    }
  },
  {
    title: 'Merge Sorted Array',
    slug: 'merge-sorted-array',
    difficulty: 'Easy',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    order: 5,
    description: `You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.\n\nMerge nums1 and nums2 into a single array sorted in non-decreasing order.`,
    examples: [{ input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]' }],
    constraints: ['nums1.length == m + n', 'nums2.length == n', '0 <= m, n <= 200'],
    boilerplate: {
      javascript: 'function merge(nums1, m, nums2, n) {\n  // Your code here\n}',
      python: 'def merge(nums1, m, nums2, n):\n    pass',
      java: 'public class Main {\n    public static void merge(int[] nums1, int m, int[] nums2, int n) {\n        \n    }\n}'
    }
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    order: 6,
    description: `You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [{ input: 'n = 2', output: '2', explanation: 'There are two ways to climb to the top: 1 step + 1 step, and 2 steps.' }],
    constraints: ['1 <= n <= 45'],
    boilerplate: {
      javascript: 'function climbStairs(n) {\n  // Your code here\n}',
      python: 'def climb_stairs(n):\n    pass',
      java: 'public class Main {\n    public static int climbStairs(int n) {\n        return 0;\n    }\n}'
    }
  },
  {
    title: 'Longest Common Prefix',
    slug: 'longest-common-prefix',
    difficulty: 'Easy',
    tags: ['String', 'Trie'],
    order: 7,
    description: `Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string "".`,
    examples: [{ input: 'strs = ["flower","flow","flight"]', output: '"fl"' }],
    constraints: ['1 <= strs.length <= 200', '0 <= strs[i].length <= 200'],
    boilerplate: {
      javascript: 'function longestCommonPrefix(strs) {\n  // Your code here\n}',
      python: 'def longest_common_prefix(strs):\n    pass',
      java: 'public class Main {\n    public static String longestCommonPrefix(String[] strs) {\n        return "";\n    }\n}'
    }
  },
  {
    title: 'Fibonacci Number',
    slug: 'fibonacci-number',
    difficulty: 'Easy',
    tags: ['Math', 'Dynamic Programming', 'Recursion', 'Memoization'],
    order: 8,
    description: `The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\nGiven n, calculate F(n).`,
    examples: [{ input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.' }],
    constraints: ['0 <= n <= 30'],
    boilerplate: {
      javascript: 'function fib(n) {\n  // Your code here\n}',
      python: 'def fib(n):\n    pass',
      java: 'public class Main {\n    public static int fib(int n) {\n        return 0;\n    }\n}'
    }
  },
  {
    title: 'Reverse String',
    slug: 'reverse-string',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'String'],
    order: 9,
    description: `Write a function that reverses a string. The input is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }],
    constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ASCII character.'],
    boilerplate: {
      javascript: 'function reverseString(s) {\n  // Your code here\n}',
      python: 'def reverse_string(s):\n    pass',
      java: 'public class Main {\n    public static void reverseString(char[] s) {\n        \n    }\n}'
    }
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    order: 10,
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [{ input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' }],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    boilerplate: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  // Your code here\n}',
      python: 'def length_of_longest_substring(s):\n    pass',
      java: 'public class Main {\n    public static int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}'
    }
  }
];

const allProblems = [...coreProblems, ...extraProblems];

async function seed() {
  console.log('🌱 Starting seed...');

  let created = 0;
  let skipped = 0;

  for (const problem of allProblems) {
    const exists = await prisma.problem.findUnique({ where: { slug: problem.slug } });
    if (exists) {
      skipped++;
      continue;
    }

    await prisma.problem.create({
      data: {
        title: problem.title,
        slug: problem.slug,
        description: problem.description,
        difficulty: problem.difficulty,
        tags: problem.tags,
        boilerplate: problem.boilerplate,
        examples: problem.examples,
        constraints: problem.constraints,
        order: problem.order,
      },
    });
    created++;
  }

  console.log(`✅ Seed complete: ${created} created, ${skipped} skipped.`);
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
