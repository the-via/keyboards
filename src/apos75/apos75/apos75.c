/* Copyright 2021 JasonRen(biu)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


#include "apos75.h"


#define __ NO_LED

#if defined(RGB_MATRIX_ENABLE)

led_config_t g_led_config = { {
    { 81,  80, 79, 78,  77, 76, 75 ,74,73 , 72},
    { 67,  66, 65, 64,  63, 62, 61, 60, 59 ,58},
    { 52,  51, 50, 49,  48, 47, 46, 45, 44, 43},
    { 37,  36, 35, 34,  33, 32, 31, 30, 29, 28},
    { 23,  22, 21, 20,  19, 18, 17, 16, 15, 14},
    { 9 ,  8,   7,  6,  5,  4,   3,  2,  1 , 0},

    { 71,  70, 69, 68 , __ ,57,  56, 55,  54, 53 },
    { 42,  41, 40, 39, 38 , 27,  __, 26,  25, 24 },
    { 13,  __, 12, 11,  10 },


}, {
    // under-, per-key
    // pattern is complex; starts at btm-lft, zig-zags up, and ends top-lft
    {224,64 },  {208,64 },{ 192,64}, {176,64 }, {160,64 }, {144,64 }, {128,64 }, {112,64 }, {96,64 }, {80,64 },   {64,64 }, {48,64 },  {32,64 },  {16,64 },

    {224,52 }, {208,52 }, {192,52 }, {176,52 }, {160,52 }, {144,52 }, { 128,52}, {112,52 },{96,52 }, { 80,52 },  { 64,52 }, {56,52 }, {48,52 },  {32,52 },   {8,52 },

    {224,40 }, {208,40 }, {192,40 }, {176,40 }, {160,40 }, {144,40 }, { 128,40}, {112,40 },{96,40 }, {80,40 },   {64,40 },  {56,40 }, {48,40 },   {32,40 },  {8,40 },

    {224,27 }, {208,27 }, {192,27 }, {176,27 }, {160,27 }, {144,27 }, {128,27 }, {112,27 },{96,27 }, {89,27 },   { 64,27},     { 56,27 },        { 32,27},    {8,27 },

    {224,15 },   {208,15 }, {192,15 }, {176,15 }, {160,15 }, {144,15 }, {128,15 }, {112,15 },{96,15 }, {89,15 },  {64,15 },          {56,15 },   {32,15 },    {8,15 },

    {224,0  }, {108,0  }, {192,0  },                        {128,0  },                                {89,0 },  {89,0 },  { 64,0  },  { 52,0  },  { 26,0 },    {8,0  },

#ifndef APOS75_DISABLE_UNDERGLOW
    { 0,57 }, {28,57}, {56,57 }, {84,57 }, {112,57 },{140,57 },{168,57 },{196,57 }, {224,57 },
    { 224,32},
    { 0,32  },
    {224,7  },{196,7  }, {168,7 }, {140,7 }, {112,7 },{84,7  }, { 56,7 } ,{28,7  }, {  0,7 },
#endif

}, {
    // under-, per-key
    1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1,
    1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1,
    1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1,
    1, 1, 1, 1, 1, 1, 1, 1 ,1, 1

    #ifndef APOS75_DISABLE_UNDERGLOW
    , 2, 2, 2, 2, 2,2,2,2,2,2,
    2, 2, 2, 2, 2,2,2,2,2,2
    #endif
} };

#endif  // RGB_MATRIX_ENABLE


