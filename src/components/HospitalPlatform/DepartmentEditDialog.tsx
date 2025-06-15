
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Department } from "./types";

type Props = {
  open: boolean;
  initial?: Department | null;
  onSubmit: (data: Partial<Department>) => void;
  onClose: () => void;
};

const DepartmentEditDialog: React.FC<Props> = ({ open, initial, onSubmit, onClose }) => {
  const [name, setName] = useState(initial?.name || "");
  const [beds, setBeds] = useState(initial?.beds ?? 0);
  const [total, setTotal] = useState(initial?.total ?? 0);

  useEffect(() => {
    setName(initial?.name || "");
    setBeds(initial?.beds ?? 0);
    setTotal(initial?.total ?? 0);
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "") return;
    onSubmit({ name, beds, total });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit" : "Add"} Department</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Department Name" required />
          <Input value={beds} type="number" onChange={e => setBeds(Number(e.target.value))} placeholder="Free Beds" min={0} />
          <Input value={total} type="number" onChange={e => setTotal(Number(e.target.value))} placeholder="Total Beds" min={0} />
          <DialogFooter>
            <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
            <Button type="submit">{initial ? "Save" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentEditDialog;
