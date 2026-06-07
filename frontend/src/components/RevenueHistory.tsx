import { useState, useEffect } from "react";
import { Table, Button, DatePicker, Space, Tag, Popconfirm, message, Typography } from "antd";
import { EditOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import type { RevenueRecord } from "../types";
import { fetchRevenueRecords, deleteRevenueRecord } from "../api/client";

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface RevenueHistoryProps {
  onEdit: (record: RevenueRecord) => void;
  refreshTrigger?: number;
}

export function RevenueHistory({ onEdit, refreshTrigger }: RevenueHistoryProps) {
  const [data, setData] = useState<RevenueRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: {
        startDate?: string;
        endDate?: string;
        page: number;
        pageSize: number;
      } = {
        page,
        pageSize,
      };

      if (dateRange && dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].format("YYYY-MM-DD");
        params.endDate = dateRange[1].format("YYYY-MM-DD");
      }

      const response = await fetchRevenueRecords(params);
      if (response.success) {
        setData(response.data.list);
        setTotal(response.data.total);
      }
    } catch (error) {
      message.error("加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, dateRange, refreshTrigger]);

  const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
    setDateRange(dates);
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRevenueRecord(id);
      message.success("删除成功");
      loadData();
    } catch (error) {
      message.error("删除失败");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: ColumnsType<RevenueRecord> = [
    {
      title: "场次时间",
      dataIndex: "sessionTime",
      key: "sessionTime",
      width: 180,
      render: (value) => formatDate(value),
    },
    {
      title: "主题",
      dataIndex: "themeName",
      key: "themeName",
      width: 140,
      render: (value) => <Tag color="magenta">{value}</Tag>,
    },
    {
      title: "收入",
      dataIndex: "income",
      key: "income",
      width: 100,
      render: (value: number) => <span style={{ color: "#52c41a", fontWeight: 600 }}>¥{value.toFixed(2)}</span>,
    },
    {
      title: "支出",
      dataIndex: "expense",
      key: "expense",
      width: 100,
      render: (value: number) => <span style={{ color: "#ff4d4f" }}>¥{value.toFixed(2)}</span>,
    },
    {
      title: "利润",
      key: "profit",
      width: 100,
      render: (_, record) => {
        const profit = record.income - record.expense;
        return (
          <span style={{ color: profit >= 0 ? "#52c41a" : "#ff4d4f", fontWeight: 600 }}>
            ¥{profit.toFixed(2)}
          </span>
        );
      },
    },
    {
      title: "预约人数",
      dataIndex: "reservationCount",
      key: "reservationCount",
      width: 90,
      align: "center",
    },
    {
      title: "实际上座",
      dataIndex: "actualAttendance",
      key: "actualAttendance",
      width: 90,
      align: "center",
    },
    {
      title: "履约率",
      key: "fulfillment",
      width: 90,
      align: "center",
      render: (_, record) => {
        if (record.reservationCount === 0) return "-";
        const rate = Math.round((record.actualAttendance / record.reservationCount) * 100);
        const color = rate >= 90 ? "green" : rate >= 70 ? "blue" : "orange";
        return <Tag color={color}>{rate}%</Tag>;
      },
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除此记录？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="work-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>营收历史记录</Title>
        <Space>
          <RangePicker onChange={handleDateChange as any} placeholder={["开始日期", "结束日期"]} />
          <Button icon={<ReloadOutlined />} onClick={loadData}>
            刷新
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1100 }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: false,
          showTotal: (t) => `共 ${t} 条记录`,
          onChange: (p) => setPage(p),
        }}
      />
    </div>
  );
}
