import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Select, message } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { CreateRevenueRequest, RevenueRecord } from "../types";
import { createRevenueRecord, updateRevenueRecord } from "../api/client";

interface RevenueFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingRecord?: RevenueRecord | null;
}

const themeOptions = [
  "冥府之路",
  "时光回廊",
  "深渊回响",
  "寂静岭",
  "盗梦空间",
  "密室逃脱经典版",
];

interface RevenueFormValues extends Omit<CreateRevenueRequest, "sessionTime"> {
  sessionTime: Dayjs;
}

export function RevenueFormModal({ open, onCancel, onSuccess, editingRecord }: RevenueFormModalProps) {
  const [form] = Form.useForm<RevenueFormValues>();

  useEffect(() => {
    if (open) {
      if (editingRecord) {
        form.setFieldsValue({
          themeName: editingRecord.themeName,
          sessionTime: dayjs(editingRecord.sessionTime),
          income: editingRecord.income,
          expense: editingRecord.expense,
          actualAttendance: editingRecord.actualAttendance,
          reservationCount: editingRecord.reservationCount,
          remark: editingRecord.remark,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingRecord, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues: CreateRevenueRequest = {
        ...values,
        sessionTime: values.sessionTime.format("YYYY-MM-DD HH:mm:ss"),
      };

      if (editingRecord) {
        await updateRevenueRecord(editingRecord.id, formattedValues);
        message.success("更新成功");
      } else {
        await createRevenueRecord(formattedValues);
        message.success("录入成功");
      }

      onSuccess();
      onCancel();
    } catch (error) {
      message.error(editingRecord ? "更新失败" : "录入失败");
    }
  };

  return (
    <Modal
      title={editingRecord ? "编辑营收记录" : "营收录入"}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={editingRecord ? "保存" : "提交"}
      cancelText="取消"
      width={520}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          income: 0,
          expense: 0,
          actualAttendance: 0,
          reservationCount: 0,
        }}
      >
        <Form.Item
          label="主题名称"
          name="themeName"
          rules={[{ required: true, message: "请选择主题" }]}
        >
          <Select placeholder="请选择主题" options={themeOptions.map((t) => ({ label: t, value: t }))} />
        </Form.Item>

        <Form.Item
          label="场次时间"
          name="sessionTime"
          rules={[{ required: true, message: "请选择场次时间" }]}
        >
          <DatePicker showTime style={{ width: "100%" }} format="YYYY-MM-DD HH:mm" />
        </Form.Item>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Form.Item
            label="收入 (元)"
            name="income"
            rules={[{ required: true, message: "请输入收入" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} precision={2} placeholder="请输入收入" />
          </Form.Item>

          <Form.Item
            label="支出 (元)"
            name="expense"
            rules={[{ required: true, message: "请输入支出" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} precision={2} placeholder="请输入支出" />
          </Form.Item>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Form.Item
            label="预约人数"
            name="reservationCount"
            rules={[{ required: true, message: "请输入预约人数" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} placeholder="请输入预约人数" />
          </Form.Item>

          <Form.Item
            label="实际上座人数"
            name="actualAttendance"
            rules={[{ required: true, message: "请输入实际上座人数" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} placeholder="请输入实际上座人数" />
          </Form.Item>
        </div>

        <Form.Item label="备注" name="remark">
          <Input.TextArea rows={3} placeholder="可选，记录本场次特殊情况" maxLength={500} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
}
