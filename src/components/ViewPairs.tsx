import { useEffect, useState } from 'react'
import { getPairsForUser } from '../services/pair'
import styled from 'styled-components'
import { Button } from '../shared'
import { getProblemsForUser } from '../services/problem'

const PairContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
`

const Table = styled.table`
  width: 80%;
  margin: 0 auto;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`

const TableRow = styled.tr`
  border-bottom: 1px solid #333333;
  font-size: 1em;
  font-weight: 500;
  font-style: normal;
  text-align: left;
`

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  background-color: #323232;
  width: 20%;
`

const TableCell = styled.td`
  padding: 12px;
`

const Empty = styled.div`
  margin-top: 8%;
  text-align: center;
`

type PairProps = {
  date: string
  p_fname: string
  p_lname: string
  p_email: string
  p_discord: string
  p_major: string
  p_grad_year: string
  problem_link?: string
  topic?: string
}

// PairView component
const PairView = ({
  date,
  p_fname,
  p_lname,
  p_email,
  p_discord,
  p_major,
  p_grad_year,
  problem_link,
  topic
}: PairProps) => {
  const dateStr = new Date(date).toLocaleDateString()
  return (
    <PairContainer>
      <Table>
        <tbody>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableCell>{dateStr}</TableCell>
          </TableRow>
          <TableRow>
            <TableHeader>First Name</TableHeader>
            <TableCell>{p_fname}</TableCell>
          </TableRow>
          <TableRow>
            <TableHeader>Last Name</TableHeader>
            <TableCell>{p_lname}</TableCell>
          </TableRow>
          <TableRow>
            <TableHeader>Email</TableHeader>
            <TableCell>{p_email}</TableCell>
          </TableRow>
          <TableRow>
            <TableHeader>Discord</TableHeader>
            <TableCell>{p_discord}</TableCell>
          </TableRow>
          <TableRow>
            <TableHeader>Major</TableHeader>
            <TableCell>{p_major}</TableCell>
          </TableRow>
          <TableRow>
            <TableHeader>Graduation Year</TableHeader>
            <TableCell>{p_grad_year}</TableCell>
          </TableRow>
          {problem_link && topic && (
            <>
              <TableRow>
                <TableHeader>Interviewing partner on</TableHeader>
                <TableCell><a href={problem_link}>{problem_link}</a></TableCell>
              </TableRow>
              <TableRow>
                <TableHeader>Topic</TableHeader>
                <TableCell>{topic}</TableCell>
              </TableRow>
            </>
          )}

        </tbody>
      </Table>
    </PairContainer>
  )
}

// Styled components for ViewPairs
const PairsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

type ViewPairsProps = {
  uuid: string
  interview_formid: number | null
}

// ViewPairs component
const ViewPairs = ({ uuid, interview_formid }: ViewPairsProps) => {
  const [pairs, setPairs] = useState<any[]>([])
  const [currentOnly, setCurrentOnly] = useState<boolean>(true)
  const [problems, setProblems] = useState<{ [key: number]: any }>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // get pairs for user
    setLoading(true)
    const fetchPairs = async () => {
      if (!uuid) return
      const pairs = await getPairsForUser(uuid)
      if (pairs && pairs.length > 0) setPairs(pairs)
    }

    const fetchProblems = async () => {
      const res = await getProblemsForUser(uuid)
      if (res) setProblems(res)
    }

    fetchPairs().then(() => {
      fetchProblems().then(() => {
        setLoading(false)
      })
    })
  }, [])

  if (loading) return <div>Loading...</div>

  const currentPair =
    interview_formid !== null
      ? pairs.find(pair => pair.form_id === interview_formid)
      : null

  const Current = () =>
    currentPair ? (
      <PairView
        date={currentPair.date}
        p_fname={currentPair.partner.first_name}
        p_lname={currentPair.partner.last_name}
        p_email={currentPair.partner.email}
        p_discord={currentPair.partner.discord}
        p_major={currentPair.partner.major}
        p_grad_year={currentPair.partner.grad_year}
        problem_link={problems[currentPair.form_id]?.problem_url}
        topic={problems[currentPair.form_id]?.topic}
      />
    ) : (
      <Empty>
        <h3>Empty...</h3>
      </Empty>
    )

  return (
    <PairsContainer>
      {currentOnly ? (
        <Current />
      ) : pairs.length > 0 ? (
        pairs.map((pair, idx) => (
          <PairView
            key={idx}
            date={pair.date}
            p_fname={pair.partner.first_name}
            p_lname={pair.partner.last_name}
            p_email={pair.partner.email}
            p_discord={pair.partner.discord}
            p_major={pair.partner.major}
            p_grad_year={pair.partner.grad_year}
            problem_link={problems[pair.form_id]?.problem_url}
            topic={problems[pair.form_id]?.topic}
          />
        ))
      ) : (
        <Empty>
          {' '}
          <h3>Empty...</h3>{' '}
        </Empty>
      )}
      <Button
        onClick={() => {
          setCurrentOnly(!currentOnly)
        }}
      >
        {currentOnly ? 'Show all' : 'Show only active partner'}
      </Button>
    </PairsContainer>
  )
}

export default ViewPairs
