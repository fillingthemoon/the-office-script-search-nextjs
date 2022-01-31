import { useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  VStack,
  HStack,
  Flex,
  Box,
  Image,
  Text,
  Button,
  Link,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
} from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useSortBy } from 'react-table'

import Layout from '../../../../components/layout'

import {
  getAllEpisodes,
  getLinesFromEpisode,
} from '../../../api/the-office-lines'

const Home = (props) => {
  const { linesFromEpisodeRes } = props
  const router = useRouter()

  const data = useMemo(() => linesFromEpisodeRes, [linesFromEpisodeRes])

  const columns = useMemo(
    () => [
      {
        Header: 'Line Id',
        accessor: 'line_id',
      },
      {
        Header: 'Season',
        accessor: 'season',
      },
      {
        Header: 'Episode',
        accessor: 'episode',
      },
      {
        Header: 'Scene',
        accessor: 'scene',
      },
      {
        Header: 'Line',
        accessor: 'line_text',
      },
      {
        Header: 'Character',
        accessor: 'speaker',
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          sortBy: [
            {
              id: 'line_id',
              asc: true,
            },
          ],
        },
      },
      useSortBy
    )

  const handleClickCell = (clickableCell, cell) => {
    if (!clickableCell) {
      return
    }

    const column = cell.column.id
    const season = cell.row.cells[1].value
    const episode = cell.row.cells[2].value
    const scene = cell.row.cells[3].value

    switch (column) {
      case 'season':
        router.push(`/all-episodes/${season}`)
        break
      case 'episode':
        router.push(`/all-episodes/${season}/${episode}`)
        break
      case 'scene':
        router.push(`/all-episodes/${season}/${episode}/${scene}`)
        break
      default:
        router.push(`/404/`)
        break
    }
  }

  return (
    <div>
      <Head>
        <title>{`Episode ${linesFromEpisodeRes[0].episode} Lines | The Office Script Search`}</title>
      </Head>
      <Layout>
        <Flex justify="center">
          <Box overflow="scroll" maxW="100vw">
            <Table {...getTableProps()} fontSize="1rem">
              <Thead>
                {headerGroups.map((headerGroup, i) => (
                  <Tr key={i} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, j) => (
                      <Th
                        key={j}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        isNumeric={column.isNumeric}
                      >
                        {column.render('Header')}
                        <chakra.span pl="4">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <TriangleDownIcon aria-label="sorted descending" />
                            ) : (
                              <TriangleUpIcon aria-label="sorted ascending" />
                            )
                          ) : null}
                        </chakra.span>
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row)
                  return (
                    <Tr key={i} {...row.getRowProps()}>
                      {row.cells.map((cell, j) => {
                        const clickableCell = [
                          'scene',
                        ].includes(cell.column.id)

                        return (
                          <Td
                            key={j}
                            {...cell.getCellProps()}
                            isNumeric={cell.column.isNumeric}
                            onClick={() => handleClickCell(clickableCell, cell)}
                            color={clickableCell && 'secondary.500'}
                            fontWeight={clickableCell && 600}
                            _hover={
                              clickableCell && {
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }
                            }
                          >
                            {cell.render('Cell')}
                          </Td>
                        )
                      })}
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </Layout>
    </div>
  )
}

// (Static Generation): Specify dynamic routes to pre-render pages based on data.
export async function getStaticPaths() {
  const { seasonNums, episodes } = await getAllEpisodes()

  const paramsArray = []
  seasonNums.forEach((seasonNum) => {
    return Object.keys(episodes).forEach((episodeNum) => {
      paramsArray.push({
        params: {
          seasonId: seasonNum.toString(),
          episodeId: episodeNum.toString(),
        },
      })
    })
  })

  return {
    fallback: false,
    paths: paramsArray,
  }
}

export async function getStaticProps(context) {
  const seasonId = context.params.seasonId
  const episodeId = context.params.episodeId
  const linesFromEpisodeRes = await getLinesFromEpisode(seasonId, episodeId)

  return {
    props: {
      linesFromEpisodeRes,
    },

    revalidate: 60,
  }
}

export default Home
