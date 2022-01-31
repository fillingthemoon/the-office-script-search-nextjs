import { useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  Flex,
  Box,
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

import Layout from '../../../../../components/layout'

import {
  getSeasonEpisodeSceneCounts,
  getLinesFromEpisode,
} from '../../../../api/the-office-lines'

const Home = (props) => {
  const { linesFromSceneRes } = props
  const router = useRouter()

  const data = useMemo(() => linesFromSceneRes, [linesFromSceneRes])

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

    router.push(`/all-episodes/${season}/${episode}`)
  }

  return (
    <div>
      <Head>
        <title>{`Episode ${linesFromSceneRes[0].episode} Lines | The Office Script Search`}</title>
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
                        const clickableCell = ['episode'].includes(
                          cell.column.id
                        )

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
  const seasonEpisodeSceneCounts = await getSeasonEpisodeSceneCounts()

  const paramsArray = []
  Object.keys(seasonEpisodeSceneCounts).forEach((seasonNum) => {
    Object.keys(seasonEpisodeSceneCounts[seasonNum]).forEach((episodeNum) => {
      for (
        let i = 0;
        i < seasonEpisodeSceneCounts[seasonNum][episodeNum];
        i++
      ) {
        const sceneNum = i + 1

        paramsArray.push({
          params: {
            seasonId: seasonNum.toString(),
            episodeId: episodeNum.toString(),
            sceneId: sceneNum.toString(),
          },
        })
      }
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
  const sceneId = context.params.sceneId
  const linesFromSceneRes = await getLinesFromEpisode(
    seasonId,
    episodeId,
    sceneId
  )

  return {
    props: {
      linesFromSceneRes,
    },

    revalidate: 60,
  }
}

export default Home
