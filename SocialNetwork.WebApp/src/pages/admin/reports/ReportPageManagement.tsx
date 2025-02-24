import { Table, TableProps, Space, Dropdown, Tag, Button, Avatar, Modal, message, Popconfirm } from "antd";
import { FC, useEffect, useState } from "react";
import { PostResource } from "../../../types/post";
import { REPORT_STATUSES, REPORT_TYPES, ReportStatusKey, ReportTypeKey } from "../../../utils/filter";
import { Eye, Filter, Trash } from "lucide-react";
import adminService from "../../../services/adminService";
import { Pagination } from "../../../types/response";
import { inititalValues } from "../../../utils/pagination";
import { TableRowSelection } from "antd/es/table/interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { ReportResource } from "../../../types/report";
import { ReportType } from "../../../enums/report-type";
import { formatDateStandard, formatDateTimeStandard } from "../../../utils/date";
import useModal from "../../../hooks/useModal";
import ResolveReportModal from "../../../components/reports/admin/ResolveReportModal";

export type UpdateReport = {
    id: string
    newStatus: string
}

const ReportPageManagement: FC = () => {
    const [reports, setReports] = useState<ReportResource[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [status, setStatus] = useState<ReportStatusKey>('ALL')
    const [type, setType] = useState<ReportTypeKey>('ALL')

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);

    const { isModalOpen, handleCancel, handleOk, showModal } = useModal();
    const [report, setReport] = useState<ReportResource>()

    const fetchReports = async (page: number, size: number) => {
        setLoading(true)
        const response = await adminService.getAllReport(page, size, status, type);
        console.log(response)
        setLoading(false)
        if (response.isSuccess) {
            setPagination(response.pagination)
            if (page === 1) {
                setReports(response.data)
            } else {
                setReports(prev => {
                    const news = response.data.filter(report =>
                        !prev.some(item => item.id === report.id)
                    );
                    return [...prev, ...news];
                });
            }
        }
    }

    useEffect(() => {
        fetchReports(1, pagination.size)
    }, [status, type]);

    const handleDeleteReport = async (reportId: string) => {
        const response = await adminService.DeleteOneReport(reportId);
        if (response.isSuccess) {
            message.success(response.message);
            fetchReports(pagination.page, pagination.size)
        } else {
            message.error(response.message)
        }
    }

    const handleDeleteMany = async (reportIds: string[]) => {
        const response = await adminService.DeleteManyReport(reportIds);
        if (response.isSuccess) {
            message.success(response.message);
            setSelectedRowKeys([])
            fetchReports(1, 6)
        } else {
            message.error(response.message)
        }
    }



    const handleDeleteAll = async () => {
        const response = await adminService.DeleteAllReport();
        if (response.isSuccess) {
            message.success(response.message);
            fetchReports(1, 6)
        } else {
            message.error(response.message)
        }
    }

    const columns: TableProps<ReportResource>['columns'] = [
        {
            title: 'Người báo cáo',
            dataIndex: 'reporter',
            key: 'reporter',
            render: (_, record) => <div className="flex items-center gap-x-2">
                <Avatar src={record.reporter.avatar} />
                <span>{record.reporter.fullName}</span>
            </div>,
        },
        {
            title: 'Nội dung bị báo cáo',
            dataIndex: 'reportType',
            key: 'reportType',
            width: 200,
            render: (value) => {
                if (value === ReportType.COMMENT)
                    return <Tag color="cyan">Bình luận</Tag>
                if (value === ReportType.POST)
                    return <Tag color="gold">Bài viết</Tag>
                if (value === ReportType.GROUP)
                    return <Tag color="processing">Nhóm</Tag>
                if (value === ReportType.USER)
                    return <Tag color="orange">Người dùng</Tag>
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (value) => {
                if (value === 'PENDING')
                    return <Tag color="gold">Chờ xử lí</Tag>
                if (value === 'RESOLVED')
                    return <Tag color="cyan">Đã xử lí</Tag>
                if (value === 'REJECTED')
                    return <Tag color="lime">Giữ nguyên nội dung</Tag>
            }
        },
        {
            title: 'Gửi lúc',
            key: 'dateCreatedAt',
            dataIndex: 'dateCreatedAt',
            render: (value) => formatDateTimeStandard(new Date(value)),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        onClick={() => {
                            setReport(record)
                            console.log(record)
                            showModal()
                        }}
                        className="!bg-green-500"
                        type="primary"
                        size="small"
                        icon={<Eye size={14} />}
                    >
                        Chi tiết
                    </Button>
                    <Popconfirm onConfirm={() => handleDeleteReport(record.id)} okText='Chắc chắn' cancelText='Hủy bỏ' title='Xóa' description='Bạn có chắc là muốn xóa báo cáo này'>
                        <Button icon={<Trash size={14} />} danger type="primary" size="small">Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<ReportResource> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const handleResolvedReport = async (newStatus: string, reportId: string) => {
        const response = await adminService.UpdateReport({
            id: reportId,
            newStatus: newStatus
        })

        if(response.isSuccess) {
            message.success(response.message);
            handleOk()
            fetchReports(pagination.page, pagination.size)
        } else {
            message.error(response.message)
        }
    }

    return <div className="flex flex-col gap-4 h-full">
        <div className="z-10 flex items-center justify-between bg-white p-4 rounded-md shadow">

            <div className="flex items-center gap-x-1">
                <Filter size={18} />
                <span className="text-[16px] font-bold">Bộ lọc</span>
            </div>

            <div className="flex items-center flex-wrap gap-y-2 gap-x-4 bg-white z-4">

                {/* Dropdown Chọn Loại Nội Dung */}
                <Dropdown
                    menu={{
                        items: REPORT_STATUSES.map((item) => ({
                            key: item.key,
                            label: item.label,
                            onClick: () => setStatus(item.key),
                        })),
                    }}
                    placement="bottom"
                >
                    <button className="py-[6px] flex items-center gap-x-3 px-4 text-sm rounded-md font-semibold bg-gray-100 hover:bg-gray-200">
                        {REPORT_STATUSES.find((item) => item.key === status)?.label
                            ?? "Tất cả"}
                        <FontAwesomeIcon className="text-gray-500" icon={faCaretDown} />
                    </button>
                </Dropdown>

                <Dropdown
                    menu={{
                        items: REPORT_TYPES.map((item) => ({
                            key: item.key,
                            label: item.label,
                            onClick: () => setType(item.key),
                        })),
                    }}
                    placement="bottom"
                >
                    <button className="py-[6px] flex items-center gap-x-3 px-4 text-sm rounded-md font-semibold bg-gray-100 hover:bg-gray-200">
                        {REPORT_TYPES.find((item) => item.key === type)?.label ?? "Tất cả"}
                        <FontAwesomeIcon className="text-gray-500" icon={faCaretDown} />
                    </button>
                </Dropdown>


            </div>
        </div>
        <div className="p-4 flex flex-col gap-y-2 shadow rounded-md bg-white">
            <div className="flex items-center justify-between">
                <span className="text-[15px]">{hasSelected ? `Đã chọn ${selectedRowKeys.length} dòng` : null}</span>

                <div className="flex items-center gap-x-2">
                    <Popconfirm
                        title={`Xóa ${selectedRowKeys.length} dòng`}
                        description={`Bạn có chắc là muốn xóa ${selectedRowKeys.length} bài viết đã chọn không`}
                        onConfirm={() => handleDeleteMany(selectedRowKeys.map(key => key.toString()))}
                        cancelText='Hủy'
                        okText='Xóa'
                    >
                        {selectedRowKeys.length > 0 && <Button type="primary" danger>Xóa {selectedRowKeys.length} dòng đã chọn</Button>}
                    </Popconfirm>
                    {reports.length > 1 && <Popconfirm
                        title={`Xóa tất cả bài viết`}
                        description={`Bạn có chắc là muốn xóa tất cả bài viết?`}
                        onConfirm={() => handleDeleteAll()}
                        cancelText='Hủy'
                        okText='Xóa'
                    >
                        <Button type="primary" danger>Xóa tất cả</Button>
                    </Popconfirm>}

                </div>
            </div>
            <Table
                columns={columns}
                dataSource={reports}
                loading={loading}
                rowKey={"id"}
                pagination={{
                    current: pagination.page,
                    total: pagination.totalCount,
                    pageSize: pagination.size
                }}
                onChange={(paginate) => {
                    if (paginate.current) {
                        fetchReports(paginate.current, pagination.size)
                    }
                }}
                rowSelection={rowSelection}
            />
        </div>

        <Modal
            style={{ top: 100 }}
            title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">Xử lí báo cáo</p>}
            open={isModalOpen}
            width={'900px'}
            onOk={handleOk}
            onCancel={handleCancel}
            classNames={{
                footer: 'hidden'
            }}
        >
            {report && <ResolveReportModal
                report={report}
                onRemove={() => handleResolvedReport('RESOLVED', report.id)}
                onKeep={() => handleResolvedReport('REJECTED', report.id)}
            />}
        </Modal>
    </div>
};

export default ReportPageManagement;
