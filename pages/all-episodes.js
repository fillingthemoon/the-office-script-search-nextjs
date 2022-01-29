import Head from 'next/head'
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
} from '@chakra-ui/react'
import Layout from '../components/layout'

const Home = (props) => {
  const {} = props

  return (
    <div>
      <Head>
        <title>All Episodes | The Office Script Search</title>
      </Head>
      <Layout>
        <Flex justify="center">
          <VStack spacing={16} alignItems="center" maxW="container.xl"></VStack>
        </Flex>
      </Layout>
    </div>
  )
}

export async function getStaticProps(context) {
  return {
    props: {
    },

    revalidate: 60,
  }
}

export default Home
