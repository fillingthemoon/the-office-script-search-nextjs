import { useState } from 'react'
import Head from 'next/head'
import {
  Flex,
  useToast,
  Input,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react'
import Layout from '../components/layout'
import PageLoadingSpinner from '../components/pageLoadingSpinner'

const SearchForm = (props) => {
  const { setShowSpinner } = props

  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const toast = useToast()

  const handleSubmit = async (event) => {
    event.preventDefault()

    setShowSpinner(true)

    const theOfficeLinesRes = await fetch(
      `/api/the-office-lines?q=${searchValue}`
    )
    const theOfficeLinesResJSON = await theOfficeLinesRes.json()

    if (theOfficeLinesRes.status === 200) {
      if (theOfficeLinesResJSON.length <= 0 || theOfficeLinesResJSON.length > 500) {
        toast({
          description: 'No lines match your search query or too many results to display. Please try again.',
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
    <form onSubmit={handleSubmit}>
      <Flex justify="center" flexDirection="column" flexWrap="wrap">
        <Input
          placeholder="Search for any line from The Office here!"
          value={searchValue}
          width={{ base: '90vw', lg: '600px' }}
          fontWeight={500}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          mb={2}
        />
        <Text fontSize="0.9rem">{`E.g., 'dunder mifflin', 'fire guy', 'pretzel', 'hunter'`}</Text>
        <Button mt={4} colorScheme={'primary'} type="submit">
          Search
        </Button>
      </Flex>
    </form>
  )
}

const Home = (props) => {
  const {} = props
  const [showSpinner, setShowSpinner] = useState(false)

  return (
    <div>
      <Head>
        <title>Search | The Office Script Search</title>
      </Head>
      <Layout>
        <Flex justify="center">
          <SearchForm setShowSpinner={setShowSpinner} />
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
