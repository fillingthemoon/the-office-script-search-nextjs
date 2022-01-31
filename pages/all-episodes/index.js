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
} from '@chakra-ui/react'
import Layout from '../../components/layout'

import { getAllEpisodes } from '../api/the-office-lines'

const Home = (props) => {
  const { seasonNums, episodes } = props
  const router = useRouter()

  const handleClickCell = (episodeItem) => {
    if (!episodeItem) {
      return
    }

    const { season, episode, title } = episodeItem

    router.push(`/all-episodes/${season}/${episode}`)
  }

  return (
    <div>
      <Head>
        <title>All Episodes | The Office Script Search</title>
      </Head>
      <Layout>
        <Flex justify="center">
          <Box overflow="scroll" maxW="100vw">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  {seasonNums.map((seasonNum, i) => {
                    return <Th key={i}>{`Season ${seasonNum}`}</Th>
                  })}
                </Tr>
              </Thead>
              <Tbody>
                {Object.keys(episodes).map((episodeNum, i) => {
                  return (
                    <Tr key={i}>
                      {episodes[episodeNum].map((episodeItem, j) => {
                        return (
                          <Td
                            key={j}
                            onClick={() => handleClickCell(episodeItem)}
                            color={'secondary.500'}
                            _hover={
                              episodeItem && {
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }
                            }
                          >
                            {episodeItem && `Ep. ${episodeItem.episode} - ${episodeItem.title}`}
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

export async function getStaticProps(context) {
  const { seasonNums, episodes } = await getAllEpisodes()

  return {
    props: {
      seasonNums,
      episodes,
    },

    revalidate: 60,
  }
}

export default Home
