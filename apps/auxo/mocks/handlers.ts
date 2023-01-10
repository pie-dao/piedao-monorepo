// src/mocks/handlers.js
import appleStock from '@visx/mock-data/lib/mocks/appleStock';
import {
  mockAllUsersQuery,
  mockFindUserQuery,
  mockGetProductsBySymbolQuery,
  mockGetTokenChartQuery,
  mockGetVaultsQuery,
  mockGetTreasuryQuery,
} from '../api/generated/graphql';
import {
  FTMContracts,
  PolygonContracts,
} from '../store/products/products.contracts';
import { INTERVAL, slicePerInterval } from '../types/intervals';

export const handlers = [
  mockAllUsersQuery((req, res, ctx) => {
    return res(
      ctx.data({
        allUsers: [{ address: '0x0' }],
      }),
    );
  }),

  mockFindUserQuery((req, res, ctx) => {
    const { address } = req.variables;
    return res(
      ctx.data({
        user: {
          address,
          totalBalance: 20090,
          twentyFourHourChange: {
            price: 20,
            change: 10,
          },
          pieVaults: [
            {
              symbol: 'PLAY',
              name: 'Play Metaverse Token',
            },
            {
              symbol: 'DEFI++',
              name: 'Play Metaverse Token',
            },
          ],
          yieldVaults: [
            {
              symbol: 'auxoWFTM',
              name: 'Auxo Wrapped Fantom Vault',
              twentyFourHourEarnings: 400,
              totalEarnings: 900,
              address: '0x16AD251B49E62995eC6f1b6A8F48A7004666397C',
            },
            {
              symbol: 'USDC',
              name: 'USDC FTM',
              twentyFourHourEarnings: 400,
              totalEarnings: 900,
              address: '0x662556422AD3493fCAAc47767E8212f8C4E24513',
            },
          ],
          performance: 30.22,
          profit: 2034345030.43,
        },
      }),
    );
  }),
  mockGetProductsBySymbolQuery((req, res, ctx) => {
    const { symbols } = req.variables;
    return res(
      ctx.data({
        tokensBySymbol: [symbols].flat().map((symbol) => ({
          marketData: [
            {
              currentPrice: 200,
              twentyFourHourChange: {
                price: 30.22,
                change: 2.4,
              },
              fromInception: -30,
              discount: -12.32,
              interests: 20,
              nav: 1.5,
              marketCap: 522058,
              holders: 420,
              allTimeHigh: 3.42,
              allTimeLow: 0.32,
              swapFee: 0.5,
              managementFee: 0.5,
              totalSupply: 2000230300,
            },
          ],
          symbol: symbol,
          riskGrade: 'AAA',
          inceptionDate: 1658831047792,
          governance: [
            {
              title: 'Votes about rebalacing for play token',
              url: 'https://www.google.it',
              status: 'passed',
              timestamp: 1658831047792,
            },
            {
              title: 'Votes about rebalacing for play token',
              url: 'https://www.google.it',
              status: 'passed',
              timestamp: 1658831047792,
            },
            {
              title: 'Votes about rebalacing for play token',
              url: 'https://www.google.it',
              status: 'passed',
              timestamp: 1658831047792,
            },
            {
              title: 'Votes about rebalacing for play token',
              url: 'https://www.google.it',
              status: 'passed',
              timestamp: 1658831047792,
            },
          ],
          underlyingTokens: [
            {
              address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
              symbol: 'MANA',
              decimals: 18,
              name: 'Mana',
              marketData: [
                {
                  currentPrice: 223.793037,
                  amountPerToken: 0.19,
                  totalHeld: 203030000,
                  allocation: 200003003,
                  twentyFourHourChange: {
                    price: 0.793037,
                    change: 3.2,
                  },
                  marginalTVLPercentage: 27.37,
                },
              ],
            },
            {
              address: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c',
              symbol: 'ENJ',
              name: 'Enjin',
              decimals: 18,
              marketData: [
                {
                  currentPrice: 3124.793037,
                  amountPerToken: 0.19,
                  totalHeld: 203030,
                  allocation: 23,
                  twentyFourHourChange: {
                    price: 0.793037,
                    change: 3.2,
                  },
                  marginalTVLPercentage: 10.69,
                },
              ],
            },
            {
              address: '0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA',
              symbol: 'GALA',
              name: 'Gala Coin',
              decimals: 8,
              marketData: [
                {
                  currentPrice: 1.793037,
                  amountPerToken: 0.19,
                  totalHeld: 200003030,
                  allocation: 200003003,
                  twentyFourHourChange: {
                    price: 0.793037,
                    change: 3.2,
                  },
                  marginalTVLPercentage: 5.47,
                },
              ],
            },
            {
              address: '0x18aAA7115705e8be94bfFEBDE57Af9BFc265B998',
              symbol: 'AUDIO',
              name: 'AudioCoin',
              decimals: 18,
              marketData: [
                {
                  currentPrice: 12.793037,
                  amountPerToken: 0.19,
                  totalHeld: 200003030,
                  allocation: 200003003,
                  twentyFourHourChange: {
                    price: 0.793037,
                    change: 3.2,
                  },
                  marginalTVLPercentage: 3.27,
                },
              ],
            },
            {
              address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
              symbol: 'SAND',
              name: 'Sand Coin',
              decimals: 18,
              marketData: [
                {
                  currentPrice: 1450.793037,
                  amountPerToken: 0.19,
                  totalHeld: 2304.2,
                  allocation: 2304041123.3,
                  twentyFourHourChange: {
                    price: 0.793037,
                    change: 3.2,
                  },
                  marginalTVLPercentage: 27.43,
                },
              ],
            },
            {
              address: '0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E',
              symbol: 'ILV',
              name: 'Illuvium',
              decimals: 18,
              marketData: [
                {
                  currentPrice: 0.793037,
                  amountPerToken: 0.19,
                  totalHeld: 3030.44,
                  allocation: 10000.344,
                  twentyFourHourChange: {
                    price: 0.793037,
                    change: 3.2,
                  },
                  marginalTVLPercentage: 6.03,
                },
              ],
            },
            {
              address: '0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b',
              symbol: 'AXS',
              name: 'AXS Token',
              decimals: 18,
              marketData: [
                {
                  currentPrice: 0.793037,
                  amountPerToken: 0.19,
                  totalHeld: 33,
                  allocation: 1201,
                  twentyFourHourChange: {
                    price: 0.793037,
                    change: 3.2,
                  },
                  marginalTVLPercentage: 16.3,
                },
              ],
            },
            {
              address: '0x25f8087EAD173b73D6e8B84329989A8eEA16CF73',
              symbol: 'YGG',
              decimals: 18,
              name: 'Yield Guild Token',
              marketData: [
                {
                  currentPrice: 0.793037,
                  amountPerToken: 0.19,
                  totalHeld: 3030,
                  allocation: 1003003,
                  twentyFourHourChange: {
                    price: 0.793037,
                    change: 3.2,
                  },
                  marginalTVLPercentage: 3.41,
                },
              ],
            },
          ],
        })),
      }),
    );
  }),
  mockGetVaultsQuery((req, res, ctx) => {
    return res(
      ctx.data({
        vaults: [...FTMContracts, ...PolygonContracts]
          .flat()
          .map((address) => ({
            underlyingToken: {
              marketData: [{ currentPrice: 230 }],
              symbol: 'FTM',
              address: '0x0',
              chain: 137,
              coinGeckoId: 'fantom',
              decimals: 18,
              kind: 'kind',
              name: 'Fantom Token',
            },
            symbol: 'auxoWFTM',
            name: 'Auxo Wrapped Fantom Vault',
            address,
            strategies: [
              {
                title: 'Beethoven LP Strategy - USDC/fUSDT/MIM liquidity pool',
                description:
                  'Supplies liquidity to Beethovenx in the Ziggy Stardust & Magic Internet Money pool. LP position earns trading fees and BEETS. This strategy tries to maximise yield by providing part of earned BEETS in the Fidelio Duetto 80/20 pool and staking Fidelio Duetto BPTs to earn more BEETS. Earned rewards are sold and reinvested.',
                allocationPercentage: 30,
                links: [
                  {
                    title: 'Link 1',
                    url: 'https://www.google.com',
                  },
                  {
                    title: 'Link 2',
                    url: 'https://www.google.com',
                  },
                ],
              },
              {
                title: 'Beethoven LP Strategy - USDC/fUSDT/MIM liquidity pool',
                description:
                  'Supplies liquidity to Beethovenx in the Ziggy Stardust & Magic Internet Money pool. LP position earns trading fees and BEETS. This strategy tries to maximise yield by providing part of earned BEETS in the Fidelio Duetto 80/20 pool and staking Fidelio Duetto BPTs to earn more BEETS. Earned rewards are sold and reinvested.',
                allocationPercentage: 70,
                links: [
                  {
                    title: 'Link 1',
                    url: 'https://www.google.com',
                  },
                  {
                    title: 'Link 2',
                    url: 'https://www.google.com',
                  },
                ],
              },
            ],
          })),
      }),
    );
  }),
  mockGetTokenChartQuery((req, res, ctx) => {
    return res(
      ctx.data({
        getTokenChart: {
          marketData: appleStock
            .slice(
              appleStock.length -
                slicePerInterval[req.variables.interval as INTERVAL],
            )
            .map(({ date: timestamp, close: currentPrice }) => ({
              timestamp,
              currentPrice,
              nav: currentPrice - 100 * Math.random(),
              totalVolume: currentPrice,
              event:
                Math.random() >= 0.98
                  ? {
                      eventType: Math.random() >= 0.5 ? 'buy' : 'sell',
                      eventData: {
                        amount: 203231231 * Math.random(),
                        priceInETH: 14030.4595923 * Math.random(),
                        priceInCurrency: 55875.4233 * Math.random(),
                      },
                    }
                  : null,
            })),
        },
      }),
    );
  }),
  mockGetTreasuryQuery((_req, res, ctx) => {
    return res(
      ctx.data({
        getTreasury: {
          content: {
            about:
              'AUXO is a stable coin pegged to U.S. dollar value issued by Frax Finance. Auxo FRAX Vault seeks yield by allocating deposited FRAX on strategies involving lending, liquidity provision, yield farming and more. Note: please ensure you have the correct FRAX tokens in your wallet, there are multiple.',
            links: [
              {
                title: 'Link 1',
                url: 'https://www.google.com',
                urlText: 'Link 2 Text',
              },
              {
                title: 'Link 2',
                url: 'https://www.google.com',
                urlText: 'Link 2 Text',
              },
            ],
            news: [
              {
                title: 'News 1',
                description:
                  'AUXO is a stable coin pegged to U.S. dollar value issued by Frax Finance. Auxo FRAX Vault seeks yield by allocating deposited FRAX on strategies involving lending, liquidity provision, yield farming and more.',
                type: 'flag',
              },
              {
                title: 'News 2',
                description:
                  'AUXO is a stable coin pegged to U.S. dollar value issued by Frax Finance. Auxo FRAX Vault seeks yield by allocating deposited FRAX on strategies involving lending, liquidity provision, yield farming and more.',
                type: 'hot',
              },
              {
                title: 'News 3',
                description:
                  'AUXO is a stable coin pegged to U.S. dollar value issued by Frax Finance. Auxo FRAX Vault seeks yield by allocating deposited FRAX on strategies involving lending, liquidity provision, yield farming and more.',
                type: 'info',
              },
            ],
          },
          marketData: {
            currentPrice: 0.793037,
            tvl: 1000000,
            tvlInEth: 1000000,
            capitalUtilisation: 22.2020133,
            avgAPR: 10.3430303,
            auxoAPR: 12.492,
            twentyFourHourChange: {
              change: 20.392,
            },
          },
        },
      }),
    );
  }),
];