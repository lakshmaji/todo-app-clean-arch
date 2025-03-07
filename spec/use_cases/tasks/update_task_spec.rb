# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UpdateTask do
  let(:update_task) { described_class.new(repository) }
  let(:repository) { TaskRepository.new }

  describe '#execute' do
    context 'when the task exists' do
      let(:task) { create(:task) }

      it 'updates the task in the repository' do
        expect do
          update_task.execute(task.id, { title: 'Updated Title' })
          task.reload
        end.to change(task, :title).to('Updated Title')
      end

      it 'raises a validation error when title is missing' do
        expect do
          update_task.execute(task.id, { title: '' })
        end.to raise_error(UpdateTask::ValidationError) { |error|
          expect(error.message).to include({ field: 'Title', message: "can't be blank" }.to_s)
        }
      end

      it 'updates the task with correct status' do
        expect do
          update_task.execute(task.id, { title: task.title, status: :completed })
          task.reload
        end.to change(task, :status).from('todo').to('completed')
      end

      it 'throw error with in correct status' do
        expect do
          update_task.execute(task.id, { title: task.title, status: :unknown })
        end.to raise_error(UpdateTask::ValidationError)
      end

      it 'not update the task with in correct status' do
        expect do
          update_task.execute(task.id, { title: task.title, status: :unknown })
        rescue StandardError
          task.reload
        end.not_to change(task, :status)
      end
    end

    context 'when the task does not exist' do
      it 'raises an ActiveRecord::RecordNotFound error' do
        expect do
          update_task.execute(-1, { title: 'Updated Title' })
        end.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
