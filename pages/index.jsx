import Layout from '../components/layout'
import MyCalender from '../components/calender';
import { getCookie } from 'cookies-next';
import Link from 'next/link'

export default function HomePage({ username }) {
    return (
        <Layout pageTitle="Home">

            <>
                <div className='d-flex justify-content-between align-items-center p-2'>
                    <h2 className='text-capitalize'>Hi {username || 'Guest'} 👋</h2>
                    {username ? <Link className='btn btn-danger' href="/api/logout">Logout</Link> : <Link className='btn btn-success' href="/login">Login</Link>}
                </div>
                <MyCalender username={username} />
            </>

        </Layout>
    );
}

export async function getServerSideProps(context) {
    const req = context.req
    const res = context.res
    var username = getCookie('username', { req, res });
    if (username == undefined) {
        username = false;
    }
    return { props: { username } };
};