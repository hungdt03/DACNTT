import React from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Space, Table } from 'antd'

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a: { age: number }, b: { age: number }) => a.age - b.age
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address'
    },
    {
        title: 'Action',
        key: 'action',
        render: () => (
            <Space size='middle'>
                <a>Delete</a>
                <a>
                    <Space>
                        More actions <DownOutlined />
                    </Space>
                </a>
            </Space>
        )
    }
]

const data = Array.from({ length: 10 }).map((_, i) => ({
    key: i,
    name: 'John Brown',
    age: Number(`${i}2`),
    address: `New York No. ${i} Lake Park`
}))

const ReportsPage: React.FC = () => {
    return <Table columns={columns} dataSource={data} pagination={{ position: ['bottomCenter'] }} />
}

export default ReportsPage
