import Navbar from './navbar'
import { Container, Flex } from '@chakra-ui/react'

const Layout = (props) => {
  const { children } = props

  return (
    <Flex minHeight="100vh" flexDirection="column">
      <Navbar />
      <Container maxW="container.xl" flexGrow={1} my={{ base: 10, md: 20 }}>
        {children}
      </Container>
    </Flex>
  )
}

export default Layout
