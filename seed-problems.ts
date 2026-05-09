/**
 * Seed standalone practice problems (not tied to any course).
 * These appear on the /practice page for all users.
 *
 * Run from the Backend-main directory:
 *   npx ts-node --esm seed-problems.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Problem from "./models/problem.model.ts";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/beyondbasic";

// ─── Starter code templates ───────────────────────────────────────────────────
const SC = {
  python: (fn: string) => `class Solution:\n    def ${fn}(self) -> None:\n        pass\n`,
  js:     (fn: string) => `/**\n * @return {void}\n */\nvar ${fn} = function() {\n    \n};\n`,
  cpp:    (fn: string) => `class Solution {\npublic:\n    void ${fn}() {\n        \n    }\n};\n`,
  java:   (fn: string) => `class Solution {\n    public void ${fn}() {\n        \n    }\n}\n`,
};

// ─── Problems dataset ─────────────────────────────────────────────────────────
const PROBLEMS = [
  // ── Arrays ───────────────────────────────────────────────────────────────────
  {
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    difficulty: "Easy",
    frequency: 5,
    topicTag: "Arrays",
    order: 1,
    leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/",
    description: `## Problem\nGiven an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.\n\n**Constraints:**\n- 1 ≤ nums.length ≤ 10⁵\n- -10⁹ ≤ nums[i] ≤ 10⁹`,
    examples: [
      { input: "nums = [1,2,3,1]", output: "true", explanation: "1 appears at indices 0 and 3." },
      { input: "nums = [1,2,3,4]", output: "false", explanation: "All elements are distinct." },
    ],
    testCases: [
      { input: "4\n1 2 3 1", expectedOutput: "true", isHidden: false },
      { input: "4\n1 2 3 4", expectedOutput: "false", isHidden: false },
      { input: "5\n1 1 1 3 3", expectedOutput: "true", isHidden: true },
    ],
    starterCode: {
      python: "class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        pass\n",
      javascript: "var containsDuplicate = function(nums) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        \n    }\n};\n",
      java: "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    frequency: 5,
    topicTag: "Arrays",
    order: 2,
    leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    description: `## Problem\nYou are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.\n\nYou want to maximize your profit by choosing a **single day** to buy and a **different day in the future** to sell.\n\nReturn the maximum profit you can achieve. If no profit is possible, return \`0\`.\n\n**Constraints:**\n- 1 ≤ prices.length ≤ 10⁵\n- 0 ≤ prices[i] ≤ 10⁴`,
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price=1), sell on day 5 (price=6), profit = 5." },
      { input: "prices = [7,6,4,3,1]", output: "0", explanation: "No profitable transaction possible." },
    ],
    testCases: [
      { input: "6\n7 1 5 3 6 4", expectedOutput: "5", isHidden: false },
      { input: "5\n7 6 4 3 1", expectedOutput: "0", isHidden: false },
      { input: "3\n1 2 3", expectedOutput: "2", isHidden: true },
    ],
    starterCode: {
      python: "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        pass\n",
      javascript: "var maxProfit = function(prices) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Product of Array Except Self",
    slug: "product-of-array-except-self",
    difficulty: "Medium",
    frequency: 5,
    topicTag: "Arrays",
    order: 3,
    leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/",
    description: `## Problem\nGiven an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.\n\nYou must write an algorithm that runs in **O(n)** time and without using the division operation.\n\n**Constraints:**\n- 2 ≤ nums.length ≤ 10⁵\n- -30 ≤ nums[i] ≤ 30`,
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: "" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]", explanation: "" },
    ],
    testCases: [
      { input: "4\n1 2 3 4", expectedOutput: "24 12 8 6", isHidden: false },
      { input: "5\n-1 1 0 -3 3", expectedOutput: "0 0 9 0 0", isHidden: true },
    ],
    starterCode: {
      python: "class Solution:\n    def productExceptSelf(self, nums: list[int]) -> list[int]:\n        pass\n",
      javascript: "var productExceptSelf = function(nums) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "Medium",
    frequency: 5,
    topicTag: "Arrays",
    order: 4,
    leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/",
    description: `## Problem\nGiven an integer array \`nums\`, find the **contiguous subarray** (containing at least one number) which has the largest sum and return its sum.\n\n**Hint:** Kadane's Algorithm\n\n**Constraints:**\n- 1 ≤ nums.length ≤ 10⁵\n- -10⁴ ≤ nums[i] ≤ 10⁴`,
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "Subarray [4,-1,2,1] has the largest sum = 6." },
      { input: "nums = [1]", output: "1", explanation: "" },
    ],
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6", isHidden: false },
      { input: "1\n1", expectedOutput: "1", isHidden: false },
      { input: "5\n-1 -2 -3 -4 -5", expectedOutput: "-1", isHidden: true },
    ],
    starterCode: {
      python: "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        pass\n",
      javascript: "var maxSubArray = function(nums) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}\n",
    },
  },

  // ── Strings ───────────────────────────────────────────────────────────────────
  {
    title: "Valid Anagram",
    slug: "valid-anagram",
    difficulty: "Easy",
    frequency: 5,
    topicTag: "Strings",
    order: 1,
    leetcodeUrl: "https://leetcode.com/problems/valid-anagram/",
    description: `## Problem\nGiven two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.\n\nAn **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.\n\n**Constraints:**\n- 1 ≤ s.length, t.length ≤ 5 × 10⁴\n- s and t consist of lowercase English letters`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true", explanation: "" },
      { input: 's = "rat", t = "car"', output: "false", explanation: "" },
    ],
    testCases: [
      { input: "anagram\nnagaram", expectedOutput: "true", isHidden: false },
      { input: "rat\ncar", expectedOutput: "false", isHidden: false },
      { input: "a\nab", expectedOutput: "false", isHidden: true },
    ],
    starterCode: {
      python: "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass\n",
      javascript: "var isAnagram = function(s, t) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};\n",
      java: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Longest Common Prefix",
    slug: "longest-common-prefix",
    difficulty: "Easy",
    frequency: 4,
    topicTag: "Strings",
    order: 2,
    leetcodeUrl: "https://leetcode.com/problems/longest-common-prefix/",
    description: `## Problem\nWrite a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string \`""\`.\n\n**Constraints:**\n- 1 ≤ strs.length ≤ 200\n- 0 ≤ strs[i].length ≤ 200\n- strs[i] consists of only lowercase English letters`,
    examples: [
      { input: 'strs = ["flower","flow","flight"]', output: '"fl"', explanation: "" },
      { input: 'strs = ["dog","racecar","car"]', output: '""', explanation: "There is no common prefix." },
    ],
    testCases: [
      { input: "3\nflower flow flight", expectedOutput: "fl", isHidden: false },
      { input: "3\ndog racecar car", expectedOutput: "", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        pass\n",
      javascript: "var longestCommonPrefix = function(strs) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        \n    }\n};\n",
      java: "class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Group Anagrams",
    slug: "group-anagrams",
    difficulty: "Medium",
    frequency: 5,
    topicTag: "Strings",
    order: 3,
    leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
    description: `## Problem\nGiven an array of strings \`strs\`, group the anagrams together. You can return the answer in **any order**.\n\n**Constraints:**\n- 1 ≤ strs.length ≤ 10⁴\n- 0 ≤ strs[i].length ≤ 100\n- strs[i] consists of lowercase English letters`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: "" },
      { input: 'strs = [""]', output: '[[""]]', explanation: "" },
    ],
    testCases: [
      { input: "6\neat tea tan ate nat bat", expectedOutput: "bat | nat tan | ate eat tea", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        pass\n",
      javascript: "var groupAnagrams = function(strs) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        \n    }\n};\n",
      java: "class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        \n    }\n}\n",
    },
  },

  // ── Two Pointers ──────────────────────────────────────────────────────────────
  {
    title: "3Sum",
    slug: "3sum",
    difficulty: "Medium",
    frequency: 5,
    topicTag: "Two Pointers",
    order: 1,
    leetcodeUrl: "https://leetcode.com/problems/3sum/",
    description: `## Problem\nGiven an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.\n\nThe solution set must not contain duplicate triplets.\n\n**Constraints:**\n- 3 ≤ nums.length ≤ 3000\n- -10⁵ ≤ nums[i] ≤ 10⁵`,
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]", explanation: "" },
    ],
    testCases: [
      { input: "6\n-1 0 1 2 -1 -4", expectedOutput: "-1 -1 2 | -1 0 1", isHidden: false },
      { input: "3\n0 0 0", expectedOutput: "0 0 0", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        pass\n",
      javascript: "var threeSum = function(nums) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};\n",
      java: "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Container With Most Water",
    slug: "container-with-most-water",
    difficulty: "Medium",
    frequency: 5,
    topicTag: "Two Pointers",
    order: 2,
    leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
    description: `## Problem\nYou are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the **maximum amount of water** a container can store.\n\n**Constraints:**\n- n == height.length\n- 2 ≤ n ≤ 10⁵\n- 0 ≤ height[i] ≤ 10⁴`,
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "The max area is between lines 2 and 9 (min(8,7) × 7 = 49)." },
      { input: "height = [1,1]", output: "1", explanation: "" },
    ],
    testCases: [
      { input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49", isHidden: false },
      { input: "2\n1 1", expectedOutput: "1", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        pass\n",
      javascript: "var maxArea = function(height) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int maxArea(int[] height) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Trapping Rain Water",
    slug: "trapping-rain-water",
    difficulty: "Hard",
    frequency: 5,
    topicTag: "Two Pointers",
    order: 3,
    leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/",
    description: `## Problem\nGiven \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.\n\n**Constraints:**\n- n == height.length\n- 1 ≤ n ≤ 2 × 10⁴\n- 0 ≤ height[i] ≤ 10⁵`,
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "6 units of water are trapped." },
      { input: "height = [4,2,0,3,2,5]", output: "9", explanation: "" },
    ],
    testCases: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6", isHidden: false },
      { input: "6\n4 2 0 3 2 5", expectedOutput: "9", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def trap(self, height: list[int]) -> int:\n        pass\n",
      javascript: "var trap = function(height) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int trap(int[] height) {\n        \n    }\n}\n",
    },
  },

  // ── Sliding Window ────────────────────────────────────────────────────────────
  {
    title: "Minimum Window Substring",
    slug: "minimum-window-substring",
    difficulty: "Hard",
    frequency: 4,
    topicTag: "Sliding Window",
    order: 1,
    leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/",
    description: `## Problem\nGiven two strings \`s\` and \`t\`, return the **minimum window substring** of \`s\` such that every character in \`t\` (including duplicates) is included in the window.\n\nIf there is no such substring, return the empty string \`""\`.\n\n**Constraints:**\n- m == s.length, n == t.length\n- 1 ≤ m, n ≤ 10⁵\n- s and t consist of uppercase and lowercase English letters`,
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: "BANC is the minimum window containing A, B, and C." },
      { input: 's = "a", t = "a"', output: '"a"', explanation: "" },
    ],
    testCases: [
      { input: "ADOBECODEBANC\nABC", expectedOutput: "BANC", isHidden: false },
      { input: "a\na", expectedOutput: "a", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        pass\n",
      javascript: "var minWindow = function(s, t) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    string minWindow(string s, string t) {\n        \n    }\n};\n",
      java: "class Solution {\n    public String minWindow(String s, String t) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Permutation in String",
    slug: "permutation-in-string",
    difficulty: "Medium",
    frequency: 4,
    topicTag: "Sliding Window",
    order: 2,
    leetcodeUrl: "https://leetcode.com/problems/permutation-in-string/",
    description: `## Problem\nGiven two strings \`s1\` and \`s2\`, return \`true\` if \`s2\` contains a permutation of \`s1\`, or \`false\` otherwise.\n\nIn other words, return \`true\` if one of \`s1\`'s permutations is the substring of \`s2\`.\n\n**Constraints:**\n- 1 ≤ s1.length, s2.length ≤ 10⁴`,
    examples: [
      { input: 's1 = "ab", s2 = "eidbaooo"', output: "true", explanation: 's2 contains "ba" which is a permutation of "ab".' },
      { input: 's1 = "ab", s2 = "eidboaoo"', output: "false", explanation: "" },
    ],
    testCases: [
      { input: "ab\neidbaooo", expectedOutput: "true", isHidden: false },
      { input: "ab\neidboaoo", expectedOutput: "false", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def checkInclusion(self, s1: str, s2: str) -> bool:\n        pass\n",
      javascript: "var checkInclusion = function(s1, s2) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    bool checkInclusion(string s1, string s2) {\n        \n    }\n};\n",
      java: "class Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        \n    }\n}\n",
    },
  },

  // ── Stacks ────────────────────────────────────────────────────────────────────
  {
    title: "Min Stack",
    slug: "min-stack",
    difficulty: "Medium",
    frequency: 4,
    topicTag: "Stacks",
    order: 1,
    leetcodeUrl: "https://leetcode.com/problems/min-stack/",
    description: `## Problem\nDesign a stack that supports push, pop, top, and retrieving the minimum element in **constant time**.\n\nImplement the \`MinStack\` class:\n- \`MinStack()\` initializes the stack object.\n- \`void push(int val)\` pushes val onto the stack.\n- \`void pop()\` removes the element on top.\n- \`int top()\` gets the top element.\n- \`int getMin()\` retrieves the minimum element in the stack.\n\n**Constraints:**\n- -2³¹ ≤ val ≤ 2³¹ - 1\n- pop, top, getMin will always be called on non-empty stacks`,
    examples: [
      { input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]', output: "[null,null,null,null,-3,null,0,-2]", explanation: "" },
    ],
    testCases: [
      { input: "push -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin", expectedOutput: "-3\n0\n-2", isHidden: false },
    ],
    starterCode: {
      python: "class MinStack:\n    def __init__(self):\n        pass\n\n    def push(self, val: int) -> None:\n        pass\n\n    def pop(self) -> None:\n        pass\n\n    def top(self) -> int:\n        pass\n\n    def getMin(self) -> int:\n        pass\n",
      javascript: "var MinStack = function() {\n    \n};\nMinStack.prototype.push = function(val) {\n    \n};\nMinStack.prototype.pop = function() {\n    \n};\nMinStack.prototype.top = function() {\n    \n};\nMinStack.prototype.getMin = function() {\n    \n};\n",
      cpp: "class MinStack {\npublic:\n    MinStack() {}\n    void push(int val) {}\n    void pop() {}\n    int top() { return 0; }\n    int getMin() { return 0; }\n};\n",
      java: "class MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}\n",
    },
  },
  {
    title: "Daily Temperatures",
    slug: "daily-temperatures",
    difficulty: "Medium",
    frequency: 5,
    topicTag: "Stacks",
    order: 2,
    leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/",
    description: `## Problem\nGiven an array of integers \`temperatures\` representing the daily temperatures, return an array \`answer\` such that \`answer[i]\` is the number of days you have to wait after the \`i\`th day to get a warmer temperature.\n\nIf there is no future day for which this is possible, keep \`answer[i] == 0\`.\n\n**Constraints:**\n- 1 ≤ temperatures.length ≤ 10⁵\n- 30 ≤ temperatures[i] ≤ 100`,
    examples: [
      { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]", explanation: "" },
      { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]", explanation: "" },
    ],
    testCases: [
      { input: "8\n73 74 75 71 69 72 76 73", expectedOutput: "1 1 4 2 1 1 0 0", isHidden: false },
      { input: "4\n30 40 50 60", expectedOutput: "1 1 1 0", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:\n        pass\n",
      javascript: "var dailyTemperatures = function(temperatures) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& temperatures) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        \n    }\n}\n",
    },
  },

  // ── Linked Lists ──────────────────────────────────────────────────────────────
  {
    title: "Reverse Linked List",
    slug: "reverse-linked-list",
    difficulty: "Easy",
    frequency: 5,
    topicTag: "Linked Lists",
    order: 1,
    leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
    description: `## Problem\nGiven the head of a singly linked list, reverse the list, and return the reversed list.\n\n**Constraints:**\n- The number of nodes in the list is in range [0, 5000]\n- -5000 ≤ Node.val ≤ 5000`,
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "" },
      { input: "head = [1,2]", output: "[2,1]", explanation: "" },
    ],
    testCases: [
      { input: "5\n1 2 3 4 5", expectedOutput: "5 4 3 2 1", isHidden: false },
      { input: "2\n1 2", expectedOutput: "2 1", isHidden: false },
    ],
    starterCode: {
      python: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def reverseList(self, head):\n        pass\n",
      javascript: "var reverseList = function(head) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        \n    }\n};\n",
      java: "class Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    difficulty: "Easy",
    frequency: 5,
    topicTag: "Linked Lists",
    order: 2,
    leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
    description: `## Problem\nYou are given the heads of two sorted linked lists \`list1\` and \`list2\`.\n\nMerge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.\n\n**Constraints:**\n- The number of nodes in both lists is in range [0, 50]\n- -100 ≤ Node.val ≤ 100`,
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "" },
      { input: "list1 = [], list2 = []", output: "[]", explanation: "" },
    ],
    testCases: [
      { input: "3\n1 2 4\n3\n1 3 4", expectedOutput: "1 1 2 3 4 4", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def mergeTwoLists(self, list1, list2):\n        pass\n",
      javascript: "var mergeTwoLists = function(list1, list2) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        \n    }\n};\n",
      java: "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Linked List Cycle",
    slug: "linked-list-cycle",
    difficulty: "Easy",
    frequency: 5,
    topicTag: "Linked Lists",
    order: 3,
    leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/",
    description: `## Problem\nGiven head, the head of a linked list, determine if the linked list has a cycle in it.\n\nReturn \`true\` if there is a cycle, otherwise return \`false\`.\n\n**Hint:** Floyd's Cycle Detection (Fast & Slow Pointers)\n\n**Constraints:**\n- The number of nodes in the list is in range [0, 10⁴]`,
    examples: [
      { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "There is a cycle where tail connects to index 1." },
      { input: "head = [1,2], pos = -1", output: "false", explanation: "No cycle." },
    ],
    testCases: [
      { input: "4\n3 2 0 -4\n1", expectedOutput: "true", isHidden: false },
      { input: "2\n1 2\n-1", expectedOutput: "false", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def hasCycle(self, head) -> bool:\n        pass\n",
      javascript: "var hasCycle = function(head) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        \n    }\n};\n",
      java: "class Solution {\n    public boolean hasCycle(ListNode head) {\n        \n    }\n}\n",
    },
  },

  // ── Trees ─────────────────────────────────────────────────────────────────────
  {
    title: "Maximum Depth of Binary Tree",
    slug: "maximum-depth-of-binary-tree",
    difficulty: "Easy",
    frequency: 5,
    topicTag: "Trees",
    order: 1,
    leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    description: `## Problem\nGiven the root of a binary tree, return its **maximum depth**.\n\nThe maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.\n\n**Constraints:**\n- The number of nodes is in range [0, 10⁴]\n- -100 ≤ Node.val ≤ 100`,
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "3", explanation: "" },
      { input: "root = [1,null,2]", output: "2", explanation: "" },
    ],
    testCases: [
      { input: "3 9 20 null null 15 7", expectedOutput: "3", isHidden: false },
      { input: "1 null 2", expectedOutput: "2", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def maxDepth(self, root) -> int:\n        pass\n",
      javascript: "var maxDepth = function(root) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int maxDepth(TreeNode root) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Invert Binary Tree",
    slug: "invert-binary-tree",
    difficulty: "Easy",
    frequency: 4,
    topicTag: "Trees",
    order: 2,
    leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/",
    description: `## Problem\nGiven the root of a binary tree, invert the tree, and return its root.\n\n**Constraints:**\n- The number of nodes is in range [0, 100]\n- -100 ≤ Node.val ≤ 100`,
    examples: [
      { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]", explanation: "" },
      { input: "root = [2,1,3]", output: "[2,3,1]", explanation: "" },
    ],
    testCases: [
      { input: "4 2 7 1 3 6 9", expectedOutput: "4 7 2 9 6 3 1", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def invertTree(self, root):\n        pass\n",
      javascript: "var invertTree = function(root) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        \n    }\n};\n",
      java: "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Validate Binary Search Tree",
    slug: "validate-binary-search-tree",
    difficulty: "Medium",
    frequency: 5,
    topicTag: "Trees",
    order: 3,
    leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/",
    description: `## Problem\nGiven the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree contains only nodes with keys **less than** the node's key.\n- The right subtree contains only nodes with keys **greater than** the node's key.\n- Both the left and right subtrees must also be valid BSTs.\n\n**Constraints:**\n- The number of nodes is in range [1, 10⁴]\n- -2³¹ ≤ Node.val ≤ 2³¹ - 1`,
    examples: [
      { input: "root = [2,1,3]", output: "true", explanation: "" },
      { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "Node 4's left child (3) is less than 5 but 4 > 5 is false." },
    ],
    testCases: [
      { input: "2 1 3", expectedOutput: "true", isHidden: false },
      { input: "5 1 4 null null 3 6", expectedOutput: "false", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def isValidBST(self, root) -> bool:\n        pass\n",
      javascript: "var isValidBST = function(root) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        \n    }\n};\n",
      java: "class Solution {\n    public boolean isValidBST(TreeNode root) {\n        \n    }\n}\n",
    },
  },

  // ── Dynamic Programming ───────────────────────────────────────────────────────
  {
    title: "House Robber",
    slug: "house-robber",
    difficulty: "Medium",
    frequency: 5,
    topicTag: "Dynamic Programming",
    order: 1,
    leetcodeUrl: "https://leetcode.com/problems/house-robber/",
    description: `## Problem\nYou are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. The only constraint is that adjacent houses have security systems connected — you **cannot rob two adjacent houses**.\n\nGiven an integer array \`nums\` representing the amount of money at each house, return the maximum amount of money you can rob without alerting the police.\n\n**Constraints:**\n- 1 ≤ nums.length ≤ 100\n- 0 ≤ nums[i] ≤ 400`,
    examples: [
      { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (1) and house 3 (3): 1 + 3 = 4." },
      { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob house 1 (2), house 3 (9), house 5 (1): 2+9+1 = 12." },
    ],
    testCases: [
      { input: "4\n1 2 3 1", expectedOutput: "4", isHidden: false },
      { input: "5\n2 7 9 3 1", expectedOutput: "12", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def rob(self, nums: list[int]) -> int:\n        pass\n",
      javascript: "var rob = function(nums) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    int rob(vector<int>& nums) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int rob(int[] nums) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Coin Change",
    slug: "coin-change",
    difficulty: "Medium",
    frequency: 5,
    topicTag: "Dynamic Programming",
    order: 2,
    leetcodeUrl: "https://leetcode.com/problems/coin-change/",
    description: `## Problem\nYou are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount cannot be made up by any combination of the coins, return \`-1\`.\n\n**Constraints:**\n- 1 ≤ coins.length ≤ 12\n- 1 ≤ coins[i] ≤ 2³¹ - 1\n- 0 ≤ amount ≤ 10⁴`,
    examples: [
      { input: "coins = [1,5,2], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1 (3 coins)." },
      { input: "coins = [2], amount = 3", output: "-1", explanation: "" },
    ],
    testCases: [
      { input: "3\n1 5 2\n11", expectedOutput: "3", isHidden: false },
      { input: "1\n2\n3", expectedOutput: "-1", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        pass\n",
      javascript: "var coinChange = function(coins, amount) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Longest Increasing Subsequence",
    slug: "longest-increasing-subsequence",
    difficulty: "Medium",
    frequency: 5,
    topicTag: "Dynamic Programming",
    order: 3,
    leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/",
    description: `## Problem\nGiven an integer array \`nums\`, return the length of the **longest strictly increasing subsequence**.\n\n**Constraints:**\n- 1 ≤ nums.length ≤ 2500\n- -10⁴ ≤ nums[i] ≤ 10⁴`,
    examples: [
      { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "The LIS is [2,3,7,101], length 4." },
      { input: "nums = [7,7,7,7,7]", output: "1", explanation: "" },
    ],
    testCases: [
      { input: "8\n10 9 2 5 3 7 101 18", expectedOutput: "4", isHidden: false },
      { input: "5\n7 7 7 7 7", expectedOutput: "1", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def lengthOfLIS(self, nums: list[int]) -> int:\n        pass\n",
      javascript: "var lengthOfLIS = function(nums) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int lengthOfLIS(int[] nums) {\n        \n    }\n}\n",
    },
  },

  // ── Graphs ────────────────────────────────────────────────────────────────────
  {
    title: "Number of Islands",
    slug: "number-of-islands",
    difficulty: "Medium",
    frequency: 5,
    topicTag: "Graphs",
    order: 1,
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
    description: `## Problem\nGiven an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\n**Constraints:**\n- m == grid.length, n == grid[i].length\n- 1 ≤ m, n ≤ 300`,
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1", explanation: "" },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: "3", explanation: "" },
    ],
    testCases: [
      { input: "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", expectedOutput: "1", isHidden: false },
      { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", expectedOutput: "3", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        pass\n",
      javascript: "var numIslands = function(grid) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int numIslands(char[][] grid) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Clone Graph",
    slug: "clone-graph",
    difficulty: "Medium",
    frequency: 4,
    topicTag: "Graphs",
    order: 2,
    leetcodeUrl: "https://leetcode.com/problems/clone-graph/",
    description: `## Problem\nGiven a reference of a node in a connected undirected graph, return a **deep copy** (clone) of the graph.\n\nEach node in the graph contains a value (int) and a list of its neighbors.\n\n**Constraints:**\n- The number of nodes is in range [0, 100]\n- 1 ≤ Node.val ≤ 100\n- No repeated edges, no self-loops`,
    examples: [
      { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]", explanation: "Deep copy of the graph." },
      { input: "adjList = [[]]", output: "[[]]", explanation: "" },
    ],
    testCases: [
      { input: "4\n2 4\n1 3\n2 4\n1 3", expectedOutput: "2 4\n1 3\n2 4\n1 3", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def cloneGraph(self, node):\n        pass\n",
      javascript: "var cloneGraph = function(node) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    Node* cloneGraph(Node* node) {\n        \n    }\n};\n",
      java: "class Solution {\n    public Node cloneGraph(Node node) {\n        \n    }\n}\n",
    },
  },

  // ── Binary Search ─────────────────────────────────────────────────────────────
  {
    title: "Search a 2D Matrix",
    slug: "search-a-2d-matrix",
    difficulty: "Medium",
    frequency: 4,
    topicTag: "Binary Search",
    order: 1,
    leetcodeUrl: "https://leetcode.com/problems/search-a-2d-matrix/",
    description: `## Problem\nYou are given an \`m x n\` integer matrix \`matrix\` with the following two properties:\n- Each row is sorted in non-decreasing order.\n- The first integer of each row is greater than the last integer of the previous row.\n\nGiven an integer \`target\`, return \`true\` if \`target\` is in the matrix, or \`false\` otherwise.\n\n**Constraints:**\n- m == matrix.length, n == matrix[i].length\n- 1 ≤ m, n ≤ 100`,
    examples: [
      { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", output: "true", explanation: "" },
      { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13", output: "false", explanation: "" },
    ],
    testCases: [
      { input: "3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3", expectedOutput: "true", isHidden: false },
      { input: "3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13", expectedOutput: "false", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:\n        pass\n",
      javascript: "var searchMatrix = function(matrix, target) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    bool searchMatrix(vector<vector<int>>& matrix, int target) {\n        \n    }\n};\n",
      java: "class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    slug: "find-minimum-in-rotated-sorted-array",
    difficulty: "Medium",
    frequency: 5,
    topicTag: "Binary Search",
    order: 2,
    leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    description: `## Problem\nSuppose an array of length \`n\` sorted in ascending order is rotated between 1 and \`n\` times.\n\nGiven the sorted rotated array \`nums\` of unique elements, return the **minimum element** of this array.\n\nYou must write an algorithm that runs in **O(log n)** time.\n\n**Constraints:**\n- n == nums.length\n- 1 ≤ n ≤ 5000\n- -5000 ≤ nums[i] ≤ 5000`,
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1", explanation: "Original: [1,2,3,4,5], rotated 3 times." },
      { input: "nums = [4,5,6,7,0,1,2]", output: "0", explanation: "" },
    ],
    testCases: [
      { input: "5\n3 4 5 1 2", expectedOutput: "1", isHidden: false },
      { input: "7\n4 5 6 7 0 1 2", expectedOutput: "0", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def findMin(self, nums: list[int]) -> int:\n        pass\n",
      javascript: "var findMin = function(nums) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int findMin(int[] nums) {\n        \n    }\n}\n",
    },
  },

  // ── Hashing ───────────────────────────────────────────────────────────────────
  {
    title: "Two Sum",
    slug: "two-sum-practice",
    difficulty: "Easy",
    frequency: 5,
    topicTag: "Hashing",
    order: 1,
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    description: `## Problem\nGiven an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n**Constraints:**\n- 2 ≤ nums.length ≤ 10⁴\n- -10⁹ ≤ nums[i] ≤ 10⁹`,
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9, return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "" },
    ],
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "0 1", isHidden: false },
      { input: "3\n3 2 4\n6", expectedOutput: "1 2", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass\n",
      javascript: "var twoSum = function(nums, target) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}\n",
    },
  },
  {
    title: "Top K Frequent Elements",
    slug: "top-k-frequent-elements",
    difficulty: "Medium",
    frequency: 5,
    topicTag: "Hashing",
    order: 2,
    leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/",
    description: `## Problem\nGiven an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in **any order**.\n\n**Constraints:**\n- 1 ≤ nums.length ≤ 10⁵\n- -10⁴ ≤ nums[i] ≤ 10⁴\n- k is in the range [1, number of unique elements]`,
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]", explanation: "" },
      { input: "nums = [1], k = 1", output: "[1]", explanation: "" },
    ],
    testCases: [
      { input: "6\n1 1 1 2 2 3\n2", expectedOutput: "1 2", isHidden: false },
      { input: "1\n1\n1", expectedOutput: "1", isHidden: false },
    ],
    starterCode: {
      python: "class Solution:\n    def topKFrequent(self, nums: list[int], k: int) -> list[int]:\n        pass\n",
      javascript: "var topKFrequent = function(nums, k) {\n    \n};\n",
      cpp: "class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        \n    }\n};\n",
      java: "class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        \n    }\n}\n",
    },
  },
];

// ─── Seed function ────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅  Connected to MongoDB");

  let created = 0;
  let skipped = 0;

  for (const p of PROBLEMS) {
    const exists = await Problem.findOne({ slug: p.slug });
    if (exists) {
      console.log(`  ⏭  Skipped (exists): ${p.title}`);
      skipped++;
      continue;
    }
    await Problem.create({ ...p, course: null, isPublished: true });
    console.log(`  ✅  Created: ${p.title}`);
    created++;
  }

  console.log(`\n🎉  Done — ${created} created, ${skipped} skipped`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
