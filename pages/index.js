import { useState, useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  Flex,
  Box,
  useToast,
  Input,
  Button,
  Text,
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

import Layout from '../components/layout'
import PageLoadingSpinner from '../components/pageLoadingSpinner'

const SearchForm = (props) => {
  const { setSearchResults, setShowSpinner, setSearchValueSaved } = props
  const toast = useToast()

  const [searchValue, setSearchValue] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    setShowSpinner(true)
    setSearchResults([])
    setSearchValueSaved(searchValue)

    const theOfficeLinesRes = await fetch(
      `/api/the-office-lines?q=${searchValue}`
    )
    const theOfficeLinesResJSON = await theOfficeLinesRes.json()

    if (theOfficeLinesRes.status === 200) {
      if (
        theOfficeLinesResJSON.length <= 0 ||
        theOfficeLinesResJSON.length > 500
      ) {
        toast({
          description:
            'No lines match your search query or too many results to display. Please try again.',
          status: 'info',
          duration: 4000,
          isClosable: true,
          position: 'top',
        })
      } else {
        setSearchResults(theOfficeLinesResJSON)

        toast({
          description: `${theOfficeLinesResJSON.length} lines found.`,
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'top',
        })
      }
    } else {
      toast({
        description: theOfficeLinesResJSON.error,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      })
    }

    setSearchValue('')
    setShowSpinner(false)
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      width={{ base: '90vw', lg: '600px' }}
      mb={14}
    >
      <Flex justify="center" flexDirection="column" flexWrap="wrap">
        <Input
          placeholder="Search for any line from The Office here!"
          value={searchValue}
          fontWeight={500}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          mb={2}
        />
        <Text fontSize="0.9rem">{`E.g., 'dunder mifflin', 'fire guy', 'pretzel', 'hunter'`}</Text>
        <Button mt={4} colorScheme={'primary'} type="submit">
          Search
        </Button>
      </Flex>
    </Box>
  )
}

const ResultsTable = (props) => {
  const { searchValueSaved, searchResults } = props
  const router = useRouter()

  const data = useMemo(() => searchResults, [searchResults])

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

  return (
    searchResults.length > 0 && (
      <Flex fontSize="1.2rem" flexDirection="column" align="center">
        <Box mb={8}>
          <Text display="inline-block">{`Showing`}</Text>{' '}
          <Text
            display="inline-block"
            fontWeight={700}
          >{`${searchResults.length}`}</Text>{' '}
          <Text display="inline-block">{`results for`}</Text>{' '}
          <Text
            display="inline-block"
            fontWeight={700}
          >{`"${searchValueSaved}"`}</Text>
        </Box>
        <Box overflow="scroll" maxW="100vw">
          <Table {...getTableProps()} fontSize="1rem">
            <Thead>
              {headerGroups.map((headerGroup, i) => (
                <Tr key={i} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, j) => (
                    <Th
                      key={j}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
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
                    {row.cells.map((cell, j) => (
                      <Td
                        key={j}
                        {...cell.getCellProps()}
                        isNumeric={cell.column.isNumeric}
                        onClick={() => router.push('/all-episodes')}
                      >
                        {cell.render('Cell')}
                      </Td>
                    ))}
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    )
  )
}

const Home = (props) => {
  const {} = props
  const [searchValueSaved, setSearchValueSaved] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSpinner, setShowSpinner] = useState(false)

  return (
    <div>
      <Head>
        <title>Search | The Office Script Search</title>
      </Head>
      <Layout>
        <Flex align="center" flexDirection="column">
          <SearchForm
            setSearchValueSaved={setSearchValueSaved}
            setShowSpinner={setShowSpinner}
            setSearchResults={setSearchResults}
          />
          <ResultsTable
            searchValueSaved={searchValueSaved}
            searchResults={searchResults}
          />
          {showSpinner && <PageLoadingSpinner />}
        </Flex>
      </Layout>
    </div>
  )
}

export async function getStaticProps(context) {
  return {
    props: {},

    revalidate: 60,
  }
}

export default Home
